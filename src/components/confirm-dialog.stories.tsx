import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { useArgs, useState } from 'storybook/preview-api'
import { fn } from 'storybook/test'

import { ConfirmDialog, type ConfirmDialogProps } from '@/components/confirm-dialog'
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
          'BaseDialog を包み、キャンセルと確定の2つの操作に絞ったダイアログ。見出し・説明・ボタンの文言とコールバックだけを指定できる。右上の閉じるボタンはなく、背景のクリックでは閉じない。Esc キーはキャンセルとして扱う。最初のフォーカスはキャンセルに置く。開閉は親が `open` で管理し、`onConfirm` または `onCancel` の中で閉じる。',
      },
    },
  },
  args: {
    open: false,
    title: '設定を適用しますか？',
    description: '現在の設定を適用します。キャンセルすると、設定は変更されません。',
    confirmLabel: '確認',
    cancelLabel: 'キャンセル',
    onConfirm: fn(),
    onCancel: fn(),
  },
  argTypes: {
    open: { control: 'boolean', description: '表示するかどうか。親が管理する' },
    title: { control: 'text', description: '見出し' },
    description: { control: 'text', description: '確認する内容の説明' },
    confirmLabel: { control: 'text', description: '確定ボタンの文言' },
    cancelLabel: { control: 'text', description: 'キャンセルボタンの文言' },
    onConfirm: { control: false, description: '確定時の処理。親で open を false にして閉じる' },
    onCancel: { control: false, description: 'キャンセル時の処理。Esc キーでも呼ばれる' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<ConfirmDialogProps>()
    const [result, setResult] = useState('未操作')

    return (
      <div className="flex flex-col items-center gap-3">
        <Button variant="outline" onClick={() => updateArgs({ open: true })}>
          確認ダイアログを開く
        </Button>
        <p role="status" className="text-sm text-muted-foreground">結果: {result}</p>
        <ConfirmDialog
          {...args}
          onConfirm={() => {
            args.onConfirm()
            setResult('確定しました')
            updateArgs({ open: false })
          }}
          onCancel={() => {
            args.onCancel()
            setResult('キャンセルしました')
            updateArgs({ open: false })
          }}
        />
      </div>
    )
  },
} satisfies Meta<typeof ConfirmDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomLabels: Story = {
  args: {
    title: '変更を保存しますか？',
    description: '変更した内容を保存します。保存せずに編集を続けることもできます。',
    confirmLabel: '保存する',
    cancelLabel: '編集を続ける',
  },
}
