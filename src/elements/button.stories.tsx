import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { ArrowRight, Plus, Trash2 } from 'lucide-react'
import { fn } from 'storybook/test'

import { Button, type ButtonProps, type ButtonPurpose } from '@/elements/button'

const PURPOSES = ['submit', 'cancel', 'execute', 'delete'] as const satisfies readonly ButtonPurpose[]
const TEXT_SIZES = ['xs', 'sm', 'default', 'lg'] as const satisfies readonly ButtonProps['size'][]
const ICON_SIZES = ['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const satisfies readonly ButtonProps['size'][]
const SIZES = [...TEXT_SIZES, ...ICON_SIZES]

const meta = {
  title: 'Elements/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '複数のコンポーネントで使える操作用のボタン。必須の purpose で送信・キャンセル・実行・削除を指定する。見た目は内部で決まり、variant・className・style・render は公開しない。size は配置の制約に合わせて選べる。submit だけがフォームを送信し、他の操作は HTML の type="button" になる。画面の移動にはリンクを使う。',
      },
    },
  },
  args: {
    children: '実行する',
    purpose: 'execute',
    size: 'default',
    onClick: fn(),
  },
  argTypes: {
    purpose: {
      control: 'select',
      options: PURPOSES,
      description: '操作の目的。submit はフォーム送信、cancel は取り消し、execute は実行、delete は削除',
      table: { type: { summary: PURPOSES.join(' | ') } },
    },
    size: {
      control: 'select',
      options: SIZES,
      description: '配置に必要な寸法。icon で始まるものはアイコンだけのボタン用',
      table: { type: { summary: SIZES.join(' | ') } },
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Execute: Story = {}
export const Submit: Story = { args: { purpose: 'submit', children: '送信する' } }
export const Cancel: Story = { args: { purpose: 'cancel', children: 'キャンセル' } }
export const Delete: Story = { args: { purpose: 'delete', children: '削除する' } }

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {TEXT_SIZES.map((size) => (
        <Button key={size} {...args} size={size}>{size}</Button>
      ))}
    </div>
  ),
}

export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args}>
        <Plus data-icon="inline-start" />
        追加する
      </Button>
      <Button {...args}>
        次へ進む
        <ArrowRight data-icon="inline-end" />
      </Button>
    </div>
  ),
}

export const IconOnly: Story = {
  args: { purpose: 'delete' },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {ICON_SIZES.map((size) => (
        <Button key={size} {...args} size={size} aria-label="削除する">
          <Trash2 />
        </Button>
      ))}
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true } }

export const InForm: Story = {
  parameters: {
    docs: {
      description: {
        story: '同じフォーム内でも submit だけが送信する。キャンセル・実行・削除を押しても送信回数は増えない。',
      },
    },
  },
  render: function Render(args) {
    const [submissions, setSubmissions] = useState(0)
    const [lastAction, setLastAction] = useState('未操作')

    return (
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          setSubmissions((count) => count + 1)
          setLastAction('送信')
        }}
      >
        <div className="flex flex-wrap gap-2">
          <Button {...args} purpose="submit">送信する</Button>
          <Button {...args} purpose="cancel" onClick={() => setLastAction('キャンセル')}>
            キャンセル
          </Button>
          <Button {...args} purpose="execute" onClick={() => setLastAction('実行')}>
            実行する
          </Button>
          <Button {...args} purpose="delete" onClick={() => setLastAction('削除')}>
            削除する
          </Button>
        </div>
        <p role="status" className="text-sm text-muted-foreground">
          送信回数: {submissions} / 最後の操作: {lastAction}
        </p>
      </form>
    )
  },
}
