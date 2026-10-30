import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { HeaderLayout } from '@/layouts/global/header-layout'

const meta = {
  title: 'Layouts/Global/HeaderLayout',
  component: HeaderLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'ヘッダーメニューとコンテンツを縦に配置するグローバルレイアウト。header と children は任意の ReactNode。メニューの項目や header / main の意味付けは差し込む側で決める。',
      },
    },
  },
  argTypes: {
    header: { control: false, description: 'ヘッダーメニューの枠に置く任意のコンポーネント' },
    children: { control: false, description: 'コンテンツの枠に置く任意のコンポーネント' },
  },
  args: {
    header: (
      <header className="flex flex-wrap items-center justify-between gap-4 border-b p-4">
        <span className="font-semibold">サービス名</span>
        <nav aria-label="ヘッダーメニュー" className="flex gap-4">
          <a href="#overview">概要</a>
          <a href="#settings">設定</a>
        </nav>
      </header>
    ),
    children: (
      <main id="overview" className="grid content-start gap-4 p-4">
        <h1 className="text-xl font-semibold">コンテンツ</h1>
        <p>ここには任意のコンポーネントやローカルレイアウトを置けます。</p>
      </main>
    ),
  },
} satisfies Meta<typeof HeaderLayout>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
