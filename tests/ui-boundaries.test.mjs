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
  ])('%s から %s は参照できる', (importer, target) => {
    expect(violationsForSource(importer, `import * as UI from '${target}'`)).toBeEmpty()
  })

  test('動的 import による Base の直接利用も検出する', () => {
    expect(violationsForSource('src/routes/example.tsx', "const ui = import('@/components/base-dialog')")).not.toBeEmpty()
  })

  test('Base の再エクスポートを検出する', () => {
    expect(violationsForSource('src/components/index.ts', "export { BaseDialog } from './base-dialog'")).not.toBeEmpty()
    expect(violationsForSource('src/components/index.ts', "export * from './base-dialog'")).not.toBeEmpty()
  })

  test('BASE COMPONENTS の専用 Story では Base を参照できる', () => {
    expect(violationsForSource('src/components/base-dialog.stories.tsx', `
      import { BaseDialog } from './base-dialog'
      export default { title: 'BASE COMPONENTS/Dialog/BaseDialog' }
    `)).toBeEmpty()
  })

  test('Base の Story でも通常の Components に掲載する場合は直接参照できない', () => {
    expect(violationsForSource('src/components/base-dialog.stories.tsx', `
      import { BaseDialog } from './base-dialog'
      export default { title: 'Components/Dialog/BaseDialog' }
    `)).not.toBeEmpty()
  })

  test('BASE COMPONENTS の名前だけでは通常の Story に Base の参照を許可しない', () => {
    expect(violationsForSource('src/components/example.stories.tsx', `
      import { BaseDialog } from './base-dialog'
      export default { title: 'BASE COMPONENTS/Dialog/Example' }
    `)).not.toBeEmpty()
  })
})
