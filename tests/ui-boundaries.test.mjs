import { describe, expect, test } from 'bun:test'

import { violationsForSource } from '../scripts/check-ui-boundaries.mjs'

describe('UI の依存ルール', () => {
  test.each([
    ['src/elements/example.tsx', '@/components/confirm-dialog'],
    ['src/elements/example.tsx', '@/layouts/global/content-layout'],
    ['src/components/example.tsx', '@/layouts/global/content-layout'],
    ['src/layouts/global/example.tsx', '@/elements/button'],
    ['src/layouts/local/example.tsx', '@/components/confirm-dialog'],
    ['src/routes/example.tsx', '@/components/base-dialog'],
    ['src/components/example.stories.tsx', './base-dialog'],
    ['src/components/index.ts', './base-dialog'],
    ['src/components/index.tsx', './base-dialog'],
    ['src/page-samples/example.stories.tsx', '@/components/base-login-form'],
    ['src/elements/example.tsx', '@/page-samples/example'],
    ['src/components/example.tsx', '@/page-samples/example'],
    ['src/layouts/global/example.tsx', '@/page-samples/example'],
  ])('%s から %s は参照できない', (importer, target) => {
    expect(violationsForSource(importer, `import * as UI from '${target}'`)).not.toBeEmpty()
  })

  test.each([
    ['src/components/example.tsx', '@/components/base-dialog'],
    ['src/components/example.tsx', '@/elements/button'],
    ['src/routes/example.tsx', '@/components/confirm-dialog'],
    ['src/routes/example.tsx', '@/layouts/global/sidebar-layout'],
    ['src/layouts/global/example.stories.tsx', '@/components/confirm-dialog'],
    ['src/layouts/global/example.tsx', '@/layouts/local/one-two-split-layout'],
    ['src/page-samples/example.stories.tsx', '@/components/email-password-login-form'],
    ['src/page-samples/example.stories.tsx', '@/layouts/global/content-layout'],
  ])('%s から %s は参照できる', (importer, target) => {
    expect(violationsForSource(importer, `import * as UI from '${target}'`)).toBeEmpty()
  })

  test('動的 import による Base の直接利用も検出する', () => {
    expect(violationsForSource('src/routes/example.tsx', "const ui = import('@/components/base-dialog')")).not.toBeEmpty()
  })

  test('Base の再エクスポートを検出する', () => {
    expect(violationsForSource('src/components/index.ts', "export { _BaseDialog } from './base-dialog'")).not.toBeEmpty()
    expect(violationsForSource('src/components/index.ts', "export * from './base-dialog'")).not.toBeEmpty()
  })

  test('Components 内の _BaseX 専用 Story では土台を参照できる', () => {
    expect(violationsForSource('src/components/base-dialog.stories.tsx', `
      import { _BaseDialog } from './base-dialog'
      export default { title: 'Components/Dialog/_BaseDialog' }
    `)).toBeEmpty()
  })

  test('Base の Story でも _BaseX の表示名でなければ直接参照できない', () => {
    expect(violationsForSource('src/components/base-dialog.stories.tsx', `
      import { _BaseDialog } from './base-dialog'
      export default { title: 'Components/Dialog/BaseDialog' }
    `)).not.toBeEmpty()
  })

  test('_BaseX の表示名だけでは通常の Story に土台の参照を許可しない', () => {
    expect(violationsForSource('src/components/example.stories.tsx', `
      import { _BaseDialog } from './base-dialog'
      export default { title: 'Components/Dialog/_BaseExample' }
    `)).not.toBeEmpty()
  })

  test('旧 BASE COMPONENTS 区分は参照用 Story として扱わない', () => {
    expect(violationsForSource('src/components/base-dialog.stories.tsx', `
      import { _BaseDialog } from './base-dialog'
      export default { title: 'BASE COMPONENTS/Dialog/_BaseDialog' }
    `)).not.toBeEmpty()
  })

  test('旧 #BaseX の表示名は参照用 Story として扱わない', () => {
    expect(violationsForSource('src/components/base-dialog.stories.tsx', `
      import { _BaseDialog } from './base-dialog'
      export default { title: 'Components/Dialog/#BaseDialog' }
    `)).not.toBeEmpty()
  })

  test('土台の export 名に _ がなければ検出する', () => {
    expect(violationsForSource('src/components/base-dialog.tsx', 'export function BaseDialog() { return null }')).not.toBeEmpty()
  })

  test('_BaseX の名前であっても公開用ファイルから export できない', () => {
    expect(violationsForSource('src/components/index.ts', 'export const _BaseDialog = () => null')).not.toBeEmpty()
  })
})
