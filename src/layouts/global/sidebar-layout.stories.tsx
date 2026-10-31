import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { ConfirmDialog, ConfirmDialogHeader, ConfirmDialogContent } from '@/components/confirm-dialog'
import { Button } from '@/elements/button'
import { SidebarLayout } from '@/layouts/global/sidebar-layout'
import { OneTwoSplitLayout } from '@/layouts/local/one-two-split-layout'

const meta = {
  title: 'Layouts/Global/SidebarLayout',
  component: SidebarLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'サイドメニュー・ヘッダー・コンテンツの配置だけを定義するグローバルレイアウト。全スロットが任意の ReactNode を受け取る。768px 未満ではヘッダー、サイドメニュー、コンテンツの順で縦に並ぶ。色・メニューの内容・操作は差し込む側で決める。',
      },
    },
  },
  argTypes: {
    sidebar: { control: false, description: 'サイドメニューの枠に置く任意のコンポーネント' },
    header: { control: false, description: 'ヘッダーの枠に置く任意のコンポーネント' },
    children: { control: false, description: 'コンテンツ。ローカルレイアウトも入れられる' },
  },
  args: {
    sidebar: (
      <aside className="h-full border-r bg-muted p-4">
        <nav aria-label="サイドメニュー" className="grid gap-3">
          <a href="#members">メンバー</a>
          <a href="#settings">設定</a>
        </nav>
      </aside>
    ),
    header: <header className="border-b p-4">メンバー管理</header>,
    children: (
      <main id="members" className="grid gap-4 p-4">
        <h1 className="text-xl font-semibold">メンバー</h1>
        <OneTwoSplitLayout
          start={<section className="border p-4"><h2>メンバー一覧</h2></section>}
          end={<section className="border p-4"><h2>メンバー詳細</h2></section>}
        />
      </main>
    ),
  },
} satisfies Meta<typeof SidebarLayout>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { name: '基本' }

export const WithConfirmation: Story = {
  name: '確認ダイアログを組み合わせる',
  render: function Render(args) {
    const [open, setOpen] = useState(false)
    const [result, setResult] = useState('未操作')

    return (
      <SidebarLayout {...args}>
        <main className="grid content-start gap-4 p-4">
          <h1 className="text-xl font-semibold">設定</h1>
          <div>
            <Button purpose="acknowledge" onClick={() => setOpen(true)}>設定を適用する</Button>
          </div>
          <p role="status">結果: {result}</p>
          <ConfirmDialog
            open={open}
            onConfirm={() => {
              setResult('適用しました')
              setOpen(false)
            }}
            onCancel={() => {
              setResult('キャンセルしました')
              setOpen(false)
            }}
          >
            <ConfirmDialogHeader>設定を適用しますか？</ConfirmDialogHeader>
            <ConfirmDialogContent>Layout は操作を持たず、差し込んだ部品が処理します。</ConfirmDialogContent>
          </ConfirmDialog>
        </main>
      </SidebarLayout>
    )
  },
}
