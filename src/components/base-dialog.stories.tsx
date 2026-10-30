import { useId, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { Button } from '@/elements/button'
import {
  _BaseDialog,
  _BaseDialogClose,
  _BaseDialogContent,
  _BaseDialogDescription,
  _BaseDialogFooter,
  _BaseDialogHeader,
  _BaseDialogTitle,
  _BaseDialogTrigger,
} from '@/components/base-dialog'

const meta = {
  title: 'Components/Dialog/_BaseDialog',
  component: _BaseDialogContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '先頭の `_` は派生実装用の土台を表す命名規約。識別子・export 名・JSX タグ・表示名を `_BaseDialog` に統一している。派生コンポーネントを作る人向けに、パーツ構成・開閉・スクロール・フォームの組み立て方を掲載する。利用画面では、操作契約を固定した ConfirmDialog や CheckboxConfirmDialog を使う。',
      },
    },
  },
  args: {
    showCloseButton: true,
  },
  argTypes: {
    showCloseButton: {
      control: 'boolean',
      description: '上部の閉じるボタンの有無。派生実装側で固定する項目',
    },
  },
} satisfies Meta<typeof _BaseDialogContent>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <_BaseDialog>
      <_BaseDialogTrigger render={<Button purpose="acknowledge" />}>ダイアログを開く</_BaseDialogTrigger>
      <_BaseDialogContent {...args}>
        <_BaseDialogHeader>
          <_BaseDialogTitle>設定を変更しました</_BaseDialogTitle>
          <_BaseDialogDescription>
            変更した内容は、次回のログインから適用されます。
          </_BaseDialogDescription>
        </_BaseDialogHeader>
        <_BaseDialogFooter showCloseButton />
      </_BaseDialogContent>
    </_BaseDialog>
  ),
}

export const CustomCloseButton: Story = {
  args: { showCloseButton: false },
  parameters: {
    docs: {
      description: {
        story: '派生実装で `_BaseDialogClose` に独自の文言と、ユーザーの意思に合う Button を組み合わせる例。',
      },
    },
  },
  render: (args) => (
    <_BaseDialog>
      <_BaseDialogTrigger render={<Button purpose="acknowledge" />}>内容を確認する</_BaseDialogTrigger>
      <_BaseDialogContent {...args}>
        <_BaseDialogHeader>
          <_BaseDialogTitle>内容を確認してください</_BaseDialogTitle>
          <_BaseDialogDescription>
            お知らせを確認したら、ボタンを押して元の画面に戻れます。
          </_BaseDialogDescription>
        </_BaseDialogHeader>
        <_BaseDialogFooter>
          <_BaseDialogClose render={<Button purpose="acknowledge" />}>確認しました</_BaseDialogClose>
        </_BaseDialogFooter>
      </_BaseDialogContent>
    </_BaseDialog>
  ),
}

export const WithoutTopCloseButton: Story = {
  args: { showCloseButton: false },
  parameters: {
    docs: {
      description: {
        story: '上部の閉じるボタンを省き、フッターに閉じる操作を残す構成。Base の既定では Esc と背景クリックでも閉じる。派生実装側で必要な閉じ方を固定する。',
      },
    },
  },
  render: (args) => (
    <_BaseDialog>
      <_BaseDialogTrigger render={<Button purpose="acknowledge" />}>フッターで閉じる構成を開く</_BaseDialogTrigger>
      <_BaseDialogContent {...args}>
        <_BaseDialogHeader>
          <_BaseDialogTitle>お知らせ</_BaseDialogTitle>
          <_BaseDialogDescription>
            内容を確認したら、下の閉じるボタンから元の画面に戻れます。
          </_BaseDialogDescription>
        </_BaseDialogHeader>
        <_BaseDialogFooter showCloseButton />
      </_BaseDialogContent>
    </_BaseDialog>
  ),
}

export const ScrollableContent: Story = {
  parameters: {
    docs: {
      description: {
        story: '派生実装で本文だけをスクロールさせる構成。見出しとフッターの閉じる操作を常に表示する。',
      },
    },
  },
  render: (args) => (
    <_BaseDialog>
      <_BaseDialogTrigger render={<Button purpose="acknowledge" />}>長い内容を開く</_BaseDialogTrigger>
      <_BaseDialogContent
        {...args}
        className="max-h-[min(36rem,calc(100dvh-2rem))] grid-rows-[auto_minmax(0,1fr)_auto]"
      >
        <_BaseDialogHeader>
          <_BaseDialogTitle>ご利用の前に</_BaseDialogTitle>
          <_BaseDialogDescription>サービスを利用する際の注意事項をご確認ください。</_BaseDialogDescription>
        </_BaseDialogHeader>
        <div className="min-h-0 space-y-4 overflow-y-auto pr-2">
          {Array.from({ length: 12 }, (_, index) => (
            <section key={index} className="space-y-2">
              <h3 className="font-medium">第 {index + 1} 項</h3>
              <p className="text-muted-foreground">
                アカウント情報はご自身で管理し、第三者と共有しないでください。
                ご不明な点がある場合は、サポート窓口へお問い合わせください。
              </p>
            </section>
          ))}
        </div>
        <_BaseDialogFooter showCloseButton />
      </_BaseDialogContent>
    </_BaseDialog>
  ),
}

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'open と onOpenChange で開閉を制御し、フォームと組み合わせる派生実装用の例。保存時は表示名を更新して閉じ、キャンセル時は変更しない。',
      },
    },
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('山田 太郎')
    const nameId = useId()

    return (
      <div className="flex flex-col items-center gap-3">
        <p role="status" className="text-sm text-muted-foreground">表示名: {name}</p>
        <_BaseDialog open={open} onOpenChange={setOpen}>
          <_BaseDialogTrigger render={<Button purpose="acknowledge" />}>表示名を編集</_BaseDialogTrigger>
          <_BaseDialogContent {...args}>
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                const formData = new FormData(event.currentTarget)
                setName(String(formData.get('name')).trim())
                setOpen(false)
              }}
            >
              <_BaseDialogHeader>
                <_BaseDialogTitle>表示名を編集</_BaseDialogTitle>
                <_BaseDialogDescription>プロフィールに表示する名前を変更できます。</_BaseDialogDescription>
              </_BaseDialogHeader>
              <div className="grid gap-2">
                <label htmlFor={nameId} className="font-medium">表示名</label>
                <input
                  id={nameId}
                  name="name"
                  defaultValue={name}
                  required
                  pattern={'.*\\S.*'}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
              <_BaseDialogFooter>
                <_BaseDialogClose render={<Button purpose="decline" />}>キャンセル</_BaseDialogClose>
                <Button purpose="agree" type="submit">保存</Button>
              </_BaseDialogFooter>
            </form>
          </_BaseDialogContent>
        </_BaseDialog>
      </div>
    )
  },
}
