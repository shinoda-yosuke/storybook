import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { fn } from 'storybook/test'

import { useAsyncConfirmationExample } from '../../.storybook/use-async-confirmation-example'

import {
  CheckboxConfirmDialog,
  CheckboxConfirmDialogHeader,
  CheckboxConfirmDialogContent,
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
          '`_BaseDialog` を包み、チェックするまで確定できないダイアログ。子要素に CheckboxConfirmDialogHeader と CheckboxConfirmDialogContent をこの順で1つずつ渡す。見出しには inline code などの JSX、本文には表などを入れられる。チェック状態は内部で管理し、開くたびに未チェックに戻る。ボタン構成と閉じ方は派生コンポーネント側で固定する。背景のクリックでは閉じず、Esc キーはキャンセルとして扱う。最初のフォーカスは見出しに置く。開閉は親が `open` で管理し、各コールバックで閉じる。',
      },
    },
  },
  args: {
    open: false,
    children: [
      <CheckboxConfirmDialogHeader>次に進む前に</CheckboxConfirmDialogHeader>,
      <CheckboxConfirmDialogContent>
        注意事項を確認し、チェックを入れてから次に進んでください。
      </CheckboxConfirmDialogContent>,
    ],
    checkboxLabel: '注意事項を確認しました',
    confirmLabel: '次へ',
    cancelLabel: 'キャンセル',
    onConfirm: fn(),
    onCancel: fn(),
  },
  argTypes: {
    open: { control: false, description: '表示するかどうか。親が管理する。表示例はボタンで開閉する' },
    children: { control: false, description: 'CheckboxConfirmDialogHeader と CheckboxConfirmDialogContent をこの順で1つずつ渡す' },
    checkboxLabel: { control: 'text', description: 'チェックして確認する内容' },
    confirmLabel: { control: 'text', description: 'チェック後に進むボタンの文言' },
    cancelLabel: { control: 'text', description: 'キャンセルボタンの文言' },
    pending: { control: false, description: '親が管理する処理中の状態。チェック変更・確定・キャンセル・Esc を無効にする' },
    error: { control: false, description: '失敗時の内容。任意の ReactNode を読み上げ可能な alert として表示する' },
    onConfirm: { control: false, description: 'チェック済みの場合だけ呼ばれる確定時の処理' },
    onCancel: { control: false, description: 'キャンセル時の処理。Esc キーでも呼ばれる' },
  },
  render: function Render(args) {
    const [open, setOpen] = useState(args.open)
    const [result, setResult] = useState('未操作')

    return (
      <div className="flex flex-col items-center gap-3">
        <Button purpose="acknowledge" onClick={() => setOpen(true)}>
          チェック必須のダイアログを開く
        </Button>
        <p role="status" className="text-sm text-muted-foreground">結果: {result}</p>
        <CheckboxConfirmDialog
          {...args}
          open={open}
          onConfirm={() => {
            args.onConfirm()
            setResult('次に進みました')
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
        </CheckboxConfirmDialog>
      </div>
    )
  },
} satisfies Meta<typeof CheckboxConfirmDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { name: '基本' }

export const CustomLabels: Story = {
  name: '文言を変更する',
  args: {
    children: [
      <CheckboxConfirmDialogHeader>申し込み内容の確認</CheckboxConfirmDialogHeader>,
      <CheckboxConfirmDialogContent>
        利用条件を確認し、同意したうえで申し込んでください。
      </CheckboxConfirmDialogContent>,
    ],
    checkboxLabel: '利用条件に同意します',
    confirmLabel: '申し込む',
    cancelLabel: '戻る',
  },
}

function MembersTable() {
  return (
    <table className="w-full text-left text-foreground">
      <caption className="mb-2 text-left text-muted-foreground">招待するメンバー</caption>
      <thead>
        <tr className="border-b">
          <th scope="col" className="pb-2 font-medium">氏名</th>
          <th scope="col" className="pb-2 font-medium">権限</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b">
          <th scope="row" className="py-2 font-normal">山田 太郎</th>
          <td className="py-2">管理者</td>
        </tr>
        <tr>
          <th scope="row" className="pt-2 font-normal">佐藤 花子</th>
          <td className="pt-2">メンバー</td>
        </tr>
      </tbody>
    </table>
  )
}

MembersTable.displayName = 'MembersTable'

export const WithTable: Story = {
  name: '表を表示する',
  args: {
    children: [
      <CheckboxConfirmDialogHeader>メンバーを招待しますか？</CheckboxConfirmDialogHeader>,
      <CheckboxConfirmDialogContent><MembersTable /></CheckboxConfirmDialogContent>,
    ],
    checkboxLabel: '招待先と権限を確認しました',
    confirmLabel: '招待する',
  },
}

export const WithInlineCode: Story = {
  name: '見出しにインラインコードを入れる',
  args: {
    children: [
      <CheckboxConfirmDialogHeader>
        ID: <code>hogehoge</code> を変更しますか？
      </CheckboxConfirmDialogHeader>,
      <CheckboxConfirmDialogContent>
        変更内容を確認し、チェックを入れてから進んでください。
      </CheckboxConfirmDialogContent>,
    ],
    checkboxLabel: '変更内容を確認しました',
    confirmLabel: '変更する',
  },
}

export const AsyncConfirmation: Story = {
  name: '処理中と失敗後の再試行',
  parameters: {
    docs: {
      description: {
        story: '親が pending・error・open を管理する例。通信の代わりに800ms待ち、最初は失敗、再試行で成功する。処理中はチェックを含め操作を止め、失敗時はチェックを保持して再試行できる。閉じてから開くと未チェックに戻る。',
      },
    },
  },
  render: function Render(args) {
    const example = useAsyncConfirmationExample()

    return (
      <div className="grid justify-items-center gap-3">
        <Button purpose="acknowledge" onClick={example.show}>非同期のチェック確認を開く</Button>
        <p role="status" className="text-sm text-muted-foreground">結果: {example.result} / 試行回数: {example.attempts}</p>
        <CheckboxConfirmDialog
          {...args}
          open={example.open}
          pending={example.pending}
          error={example.error}
          onConfirm={example.confirm}
          onCancel={example.cancel}
        >
          {args.children[0]}
          {args.children[1]}
        </CheckboxConfirmDialog>
      </div>
    )
  },
}
