import { describe, expect, test } from 'bun:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { Button } from '../src/elements/button'
import { ContentLayout } from '../src/layouts/global/content-layout'
import { HeaderLayout } from '../src/layouts/global/header-layout'
import { SidebarLayout } from '../src/layouts/global/sidebar-layout'
import { OneTwoSplitLayout } from '../src/layouts/local/one-two-split-layout'

describe('Button の操作の意味', () => {
  test.each(['agree', 'agree-to-risk', 'decline', 'acknowledge'])('%s は明示しなければフォームを送信しない', (purpose) => {
    const html = renderToStaticMarkup(h(Button, { purpose }, '操作'))
    expect(html).toContain('type="button"')
    expect(html).not.toContain('type="submit"')
  })

  test.each(['agree', 'agree-to-risk', 'decline', 'acknowledge'])('%s とフォーム送信は両立する', (purpose) => {
    const html = renderToStaticMarkup(h(Button, { purpose, type: 'submit', form: 'settings' }, '意思を送信'))
    expect(html).toContain('type="submit"')
    expect(html).toContain('form="settings"')
  })

  test('明示的な reset もユーザーの意思とは独立して指定できる', () => {
    const html = renderToStaticMarkup(h(Button, { purpose: 'decline', type: 'reset' }, '入力をやり直す'))
    expect(html).toContain('type="reset"')
  })

  test('無効な操作とアイコンのアクセシブルな名前を保持する', () => {
    const html = renderToStaticMarkup(h(Button, {
      purpose: 'acknowledge', size: 'icon', disabled: true, 'aria-label': '内容を確認する',
    }))
    expect(html).toContain('disabled=""')
    expect(html).toContain('aria-label="内容を確認する"')
  })
})

function ArbitraryContent({ name }) {
  return h('article', null, name)
}

describe('Layout は任意のコンポーネントを配置できる', () => {
  test.each([
    [ContentLayout, { children: h(ArbitraryContent, { name: 'content' }) }, ['content']],
    [HeaderLayout, {
      header: h(ArbitraryContent, { name: 'header' }),
      children: h(ArbitraryContent, { name: 'content' }),
    }, ['header', 'content']],
    [SidebarLayout, {
      sidebar: h(ArbitraryContent, { name: 'sidebar' }),
      header: h(ArbitraryContent, { name: 'header' }),
      children: h(ArbitraryContent, { name: 'content' }),
    }, ['sidebar', 'header', 'content']],
    [OneTwoSplitLayout, {
      start: h(ArbitraryContent, { name: 'start' }),
      end: h(ArbitraryContent, { name: 'end' }),
    }, ['start', 'end']],
  ])('%p は内容と landmark を固定しない', (Layout, props, expected) => {
    const html = renderToStaticMarkup(h(Layout, props))
    for (const name of expected) expect(html).toContain(`<article>${name}</article>`)
    expect(html).not.toMatch(/<(?:header|nav|main|aside)\b/)
  })
})
