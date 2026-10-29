import { useId, useState, type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { Button } from '@/elements/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog'

const meta = {
  title: 'Components/Dialog',
  component: DialogContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '画面に重ねて表示するダイアログ。shadcn/ui（Base UI・nova）の Dialog と Elements の Button を組み合わせる。`DialogTitle` と `DialogDescription` で見出しと説明を付け、`DialogTrigger` と `DialogClose` の `render` に Button を渡して使う。Esc キーや背景のクリックでも閉じられる。',
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
} satisfies Meta<typeof DialogContent>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>ダイアログを開く</DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>設定を変更しました</DialogTitle>
          <DialogDescription>
            変更した内容は、次回のログインから適用されます。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
}

export const CustomCloseButton: Story = {
  args: { showCloseButton: false },
  parameters: {
    docs: {
      description: {
        story:
          '`DialogClose` の `render` に Button を渡すと、閉じるボタンの文言や見た目を変更できる。',
      },
    },
  },
  render: (args) => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>内容を確認する</DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>内容を確認してください</DialogTitle>
          <DialogDescription>
            お知らせを確認したら、ボタンを押して元の画面に戻れます。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button />}>確認しました</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>閉じるボタンなし</DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>お知らせ</DialogTitle>
          <DialogDescription>
            このダイアログは、Esc キーを押すか背景をクリックすると閉じられます。
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
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
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>長い内容を開く</DialogTrigger>
      <DialogContent
        {...args}
        className="max-h-[min(36rem,calc(100dvh-2rem))] grid-rows-[auto_minmax(0,1fr)_auto]"
      >
        <DialogHeader>
          <DialogTitle>ご利用の前に</DialogTitle>
          <DialogDescription>サービスを利用する際の注意事項をご確認ください。</DialogDescription>
        </DialogHeader>
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
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
}

function ControlledDialog(args: ComponentProps<typeof DialogContent>) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('山田 太郎')
  const nameId = useId()

  return (
    <div className="flex flex-col items-center gap-3">
      <p role="status" className="text-sm text-muted-foreground">表示名: {name}</p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="outline" />}>表示名を編集</DialogTrigger>
        <DialogContent {...args}>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              const formData = new FormData(event.currentTarget)
              setName(String(formData.get('name')).trim())
              setOpen(false)
            }}
          >
            <DialogHeader>
              <DialogTitle>表示名を編集</DialogTitle>
              <DialogDescription>プロフィールに表示する名前を変更できます。</DialogDescription>
            </DialogHeader>
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
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>キャンセル</DialogClose>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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
