import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { fn } from 'storybook/test'

import { ConfirmDialog, ConfirmDialogHeader, ConfirmDialogContent } from '@/components/confirm-dialog'
import { Button } from '@/elements/button'

const meta = {
  title: 'Components/Dialog/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'BaseDialog を包み、キャンセルと確定の2つの操作に絞ったダイアログ。子要素に ConfirmDialogHeader と ConfirmDialogContent をこの順で1つずつ渡す。見出しには inline code などの JSX、本文には表やリストなどを入れられる。ボタン構成と閉じ方は親側で固定する。背景のクリックでは閉じず、Esc キーはキャンセルとして扱う。最初のフォーカスは見出しに置く。開閉は親が `open` で管理し、各コールバックで閉じる。',
      },
    },
  },
  args: {
    open: false,
    children: [
      <ConfirmDialogHeader>設定を適用しますか？</ConfirmDialogHeader>,
      <ConfirmDialogContent>
        現在の設定を適用します。キャンセルすると、設定は変更されません。
      </ConfirmDialogContent>,
    ],
    confirmLabel: '確認',
    cancelLabel: 'キャンセル',
    onConfirm: fn(),
    onCancel: fn(),
  },
  argTypes: {
    open: { control: false, description: '表示するかどうか。親が管理する。表示例はボタンで開閉する' },
    children: { control: false, description: 'ConfirmDialogHeader と ConfirmDialogContent をこの順で1つずつ渡す' },
    confirmLabel: { control: 'text', description: '確定ボタンの文言' },
    cancelLabel: { control: 'text', description: 'キャンセルボタンの文言' },
    onConfirm: { control: false, description: '確定時の処理。親で open を false にして閉じる' },
    onCancel: { control: false, description: 'キャンセル時の処理。Esc キーでも呼ばれる' },
  },
  render: function Render(args) {
    const [open, setOpen] = useState(args.open)
    const [result, setResult] = useState('未操作')

    return (
      <div className="flex flex-col items-center gap-3">
        <Button variant="outline" onClick={() => setOpen(true)}>
          確認ダイアログを開く
        </Button>
        <p role="status" className="text-sm text-muted-foreground">結果: {result}</p>
        <ConfirmDialog
          {...args}
          open={open}
          onConfirm={() => {
            args.onConfirm()
            setResult('確定しました')
            setOpen(false)
          }}
          onCancel={() => {
            args.onCancel()
            setResult('キャンセルしました')
            setOpen(false)
          }}
        >
          {args.children[0]}
          {args.children[1]}
        </ConfirmDialog>
      </div>
    )
  },
} satisfies Meta<typeof ConfirmDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomLabels: Story = {
  args: {
    children: [
      <ConfirmDialogHeader>変更を保存しますか？</ConfirmDialogHeader>,
      <ConfirmDialogContent>
        変更した内容を保存します。保存せずに編集を続けることもできます。
      </ConfirmDialogContent>,
    ],
    confirmLabel: '保存する',
    cancelLabel: '編集を続ける',
  },
}

export const WithList: Story = {
  args: {
    children: [
      <ConfirmDialogHeader>通知設定を変更しますか？</ConfirmDialogHeader>,
      <ConfirmDialogContent>
        <div className="space-y-3">
          <p>次の変更を適用します。</p>
          <ul className="list-inside list-disc space-y-1">
            <li>メール通知を有効にする</li>
            <li>週次レポートを受け取る</li>
          </ul>
        </div>
      </ConfirmDialogContent>,
    ],
  },
}

export const WithInlineCode: Story = {
  args: {
    children: [
      <ConfirmDialogHeader>ID: <code>hogehoge</code> を変更しますか？</ConfirmDialogHeader>,
      <ConfirmDialogContent>この ID に紐づく設定を更新します。</ConfirmDialogContent>,
    ],
    confirmLabel: '変更する',
  },
}
