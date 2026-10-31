import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { ContentLayout } from '@/layouts/global/content-layout'
import { OneTwoSplitLayout } from '@/layouts/local/one-two-split-layout'

const meta = {
  title: 'Layouts/Global/ContentLayout',
  component: ContentLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'コンテンツだけを配置するグローバルレイアウト。画面の最低高さを確保し、中身は children で受け取る。ローカルレイアウトもそのまま入れられる。',
      },
    },
  },
  argTypes: {
    children: { control: false, description: '任意のコンポーネント' },
  },
  args: {
    children: (
      <main className="grid gap-4 p-4">
        <h1 className="text-xl font-semibold">コンテンツ</h1>
        <p>ヘッダーやサイドメニューを置かない画面の枠です。</p>
      </main>
    ),
  },
} satisfies Meta<typeof ContentLayout>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { name: '基本' }

export const WithLocalLayout: Story = {
  name: 'ローカルレイアウトを組み合わせる',
  args: {
    children: (
      <main className="grid gap-4 p-4">
        <h1 className="text-xl font-semibold">コンテンツ内を 1:2 に分割</h1>
        <OneTwoSplitLayout
          start={<section className="border p-4"><h2>検索条件</h2></section>}
          end={<section className="border p-4"><h2>検索結果</h2></section>}
        />
      </main>
    ),
  },
}
