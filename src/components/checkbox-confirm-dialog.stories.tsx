import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { useArgs, useState } from 'storybook/preview-api'
import { fn } from 'storybook/test'

import {
  CheckboxConfirmDialog,
  type CheckboxConfirmDialogProps,
} from '@/components/checkbox-confirm-dialog'
import { Button } from '@/elements/button'

const meta = {
  title: 'Components/Dialog/CheckboxConfirmDialog',
  component: CheckboxConfirmDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'BaseDialog を包み、チェックするまで確定できないダイアログ。チェック状態は内部で管理し、外から有効化したり初期状態をチェック済みにしたりできない。開くたびに未チェックに戻る。ボタン構成と閉じ方は固定で、Esc キーとキャンセルボタンは `onCancel` を呼ぶ。背景のクリックでは閉じない。開閉は親が `open` で管理し、各コールバックで閉じる。',
      },
    },
  },
  args: {
    open: false,
    title: '次に進む前に',
    description: '注意事項を確認し、チェックを入れてから次に進んでください。',
    checkboxLabel: '注意事項を確認しました',
    confirmLabel: '次へ',
    cancelLabel: 'キャンセル',
    onConfirm: fn(),
    onCancel: fn(),
  },
  argTypes: {
    open: { control: 'boolean', description: '表示するかどうか。親が管理する' },
    title: { control: 'text', description: '見出し' },
    description: { control: 'text', description: '確認する内容の説明' },
    checkboxLabel: { control: 'text', description: 'チェックして確認する内容' },
    confirmLabel: { control: 'text', description: 'チェック後に進むボタンの文言' },
    cancelLabel: { control: 'text', description: 'キャンセルボタンの文言' },
    onConfirm: { control: false, description: 'チェック済みの場合だけ呼ばれる確定時の処理' },
    onCancel: { control: false, description: 'キャンセル時の処理。Esc キーでも呼ばれる' },
  },
  render: function Render() {
    const [args, updateArgs] = useArgs<CheckboxConfirmDialogProps>()
    const [result, setResult] = useState('未操作')

    return (
      <div className="flex flex-col items-center gap-3">
        <Button variant="outline" onClick={() => updateArgs({ open: true })}>
          チェック必須のダイアログを開く
        </Button>
        <p role="status" className="text-sm text-muted-foreground">結果: {result}</p>
        <CheckboxConfirmDialog
          {...args}
          onConfirm={() => {
            args.onConfirm()
            setResult('次に進みました')
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
} satisfies Meta<typeof CheckboxConfirmDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomLabels: Story = {
  args: {
    title: '申し込み内容の確認',
    description: '利用条件を確認し、同意したうえで申し込んでください。',
    checkboxLabel: '利用条件に同意します',
    confirmLabel: '申し込む',
    cancelLabel: '戻る',
  },
}
