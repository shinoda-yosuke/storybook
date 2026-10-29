import { useId, useState, type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { Button } from '@/elements/button'
import {
  BaseDialog,
  BaseDialogClose,
  BaseDialogContent,
  BaseDialogDescription,
  BaseDialogFooter,
  BaseDialogHeader,
  BaseDialogTitle,
  BaseDialogTrigger,
} from '@/components/base-dialog'

const meta = {
  title: 'Components/BaseDialog',
  component: BaseDialogContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '画面に重ねて表示するダイアログの土台。shadcn/ui（Base UI・nova）の Dialog と Elements の Button を組み合わせる。`BaseDialogTitle` と `BaseDialogDescription` で見出しと説明を付け、`BaseDialogTrigger` と `BaseDialogClose` の `render` に Button を渡して使う。用途が決まっている場合は、公開する機能を絞った ConfirmDialog や CheckboxConfirmDialog を使う。',
      },
    },
  },
  args: {
    showCloseButton: true,
  },
  argTypes: {
    showCloseButton: {
      control: 'boolean',
      description: '右上の閉じるボタンを表示する',
    },
  },
} satisfies Meta<typeof BaseDialogContent>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <BaseDialog>
      <BaseDialogTrigger render={<Button variant="outline" />}>ダイアログを開く</BaseDialogTrigger>
      <BaseDialogContent {...args}>
        <BaseDialogHeader>
          <BaseDialogTitle>設定を変更しました</BaseDialogTitle>
          <BaseDialogDescription>
            変更した内容は、次回のログインから適用されます。
          </BaseDialogDescription>
        </BaseDialogHeader>
        <BaseDialogFooter showCloseButton />
      </BaseDialogContent>
    </BaseDialog>
  ),
}

export const CustomCloseButton: Story = {
  args: { showCloseButton: false },
  parameters: {
    docs: {
      description: {
        story:
          '`BaseDialogClose` の `render` に Button を渡すと、閉じるボタンの文言や見た目を変更できる。',
      },
    },
  },
  render: (args) => (
    <BaseDialog>
      <BaseDialogTrigger render={<Button variant="outline" />}>内容を確認する</BaseDialogTrigger>
      <BaseDialogContent {...args}>
        <BaseDialogHeader>
          <BaseDialogTitle>内容を確認してください</BaseDialogTitle>
          <BaseDialogDescription>
            お知らせを確認したら、ボタンを押して元の画面に戻れます。
          </BaseDialogDescription>
        </BaseDialogHeader>
        <BaseDialogFooter>
          <BaseDialogClose render={<Button />}>確認しました</BaseDialogClose>
        </BaseDialogFooter>
      </BaseDialogContent>
    </BaseDialog>
  ),
}

export const NoCloseButton: Story = {
  args: { showCloseButton: false },
  parameters: {
    docs: {
      description: {
        story:
          '`showCloseButton={false}` で右上のボタンを非表示にする。Esc キーと背景のクリックでは閉じられる。明示的な操作を必須にする確認には Alert Dialog を使う。',
      },
    },
  },
  render: (args) => (
    <BaseDialog>
      <BaseDialogTrigger render={<Button variant="outline" />}>閉じるボタンなし</BaseDialogTrigger>
      <BaseDialogContent {...args}>
        <BaseDialogHeader>
          <BaseDialogTitle>お知らせ</BaseDialogTitle>
          <BaseDialogDescription>
            このダイアログは、Esc キーを押すか背景をクリックすると閉じられます。
          </BaseDialogDescription>
        </BaseDialogHeader>
      </BaseDialogContent>
    </BaseDialog>
  ),
}

export const ScrollableContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '内容が長い場合は、本文だけをスクロールさせる。見出しとフッターを固定し、閉じる操作を常に表示する。',
      },
    },
  },
  render: (args) => (
    <BaseDialog>
      <BaseDialogTrigger render={<Button variant="outline" />}>長い内容を開く</BaseDialogTrigger>
      <BaseDialogContent
        {...args}
        className="max-h-[min(36rem,calc(100dvh-2rem))] grid-rows-[auto_minmax(0,1fr)_auto]"
      >
        <BaseDialogHeader>
          <BaseDialogTitle>ご利用の前に</BaseDialogTitle>
          <BaseDialogDescription>サービスを利用する際の注意事項をご確認ください。</BaseDialogDescription>
        </BaseDialogHeader>
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
        <BaseDialogFooter showCloseButton />
      </BaseDialogContent>
    </BaseDialog>
  ),
}

function ControlledDialog(args: ComponentProps<typeof BaseDialogContent>) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('山田 太郎')
  const nameId = useId()

  return (
    <div className="flex flex-col items-center gap-3">
      <p role="status" className="text-sm text-muted-foreground">表示名: {name}</p>
      <BaseDialog open={open} onOpenChange={setOpen}>
        <BaseDialogTrigger render={<Button variant="outline" />}>表示名を編集</BaseDialogTrigger>
        <BaseDialogContent {...args}>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              const formData = new FormData(event.currentTarget)
              setName(String(formData.get('name')).trim())
              setOpen(false)
            }}
          >
            <BaseDialogHeader>
              <BaseDialogTitle>表示名を編集</BaseDialogTitle>
              <BaseDialogDescription>プロフィールに表示する名前を変更できます。</BaseDialogDescription>
            </BaseDialogHeader>
            <div className="grid gap-2">
              <label htmlFor={nameId} className="font-medium">表示名</label>
              <input
                id={nameId}
                name="name"
                defaultValue={name}
                required
                pattern=".*\S.*"
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <BaseDialogFooter>
              <BaseDialogClose render={<Button variant="outline" />}>キャンセル</BaseDialogClose>
              <Button type="submit">保存</Button>
            </BaseDialogFooter>
          </form>
        </BaseDialogContent>
      </BaseDialog>
    </div>
  )
}

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`open` と `onOpenChange` で開閉を制御する例。保存時は表示名を更新して閉じ、キャンセルした場合は変更しない。',
      },
    },
  },
  render: (args) => <ControlledDialog {...args} />,
}
