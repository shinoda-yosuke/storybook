import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { ArrowRight, Check, Info } from 'lucide-react'
import { fn } from 'storybook/test'

import { Button, type ButtonProps, type ButtonPurpose } from '@/elements/button'

const PURPOSES = ['agree', 'agree-to-risk', 'decline', 'acknowledge'] as const satisfies readonly ButtonPurpose[]
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
          'ユーザーを主語に、同意・危険な処理への同意・拒否・確認を表すボタン。purpose は意思表示、HTML の type は動作として独立させる。type の既定は button。size と width は配置用の Props で、色・角丸などの見た目は内部で決まる。variant・className・style・render は公開しない。画面の移動にはリンクを使う。',
      },
    },
  },
  args: {
    children: '同意する',
    purpose: 'agree',
    type: 'button',
    width: 'content',
    size: 'default',
    onClick: fn(),
  },
  argTypes: {
    purpose: {
      control: 'select',
      options: PURPOSES,
      description: 'ユーザーの意思表示。agree は同意、agree-to-risk は危険な処理への同意、decline は拒否、acknowledge は内容の認識・確認',
      table: { type: { summary: PURPOSES.join(' | ') } },
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'HTML の動作。purpose とは独立し、明示した場合だけ送信やリセットを行う',
    },
    width: {
      control: 'select',
      options: ['content', 'fill'],
      description: '配置上の幅。content は内容に合わせ、fill は配置先の幅を使う',
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

export const Agree: Story = {}
export const AgreeToRisk: Story = { args: { purpose: 'agree-to-risk', children: '危険性を理解して同意する' } }
export const Decline: Story = { args: { purpose: 'decline', children: '同意しない' } }
export const Acknowledge: Story = { args: { purpose: 'acknowledge', children: '確認しました' } }

export const FillWidth: Story = {
  args: { width: 'fill' },
  render: (args) => <div className="w-full max-w-sm"><Button {...args} /></div>,
}

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
        <Check data-icon="inline-start" />
        同意する
      </Button>
      <Button {...args}>
        次へ進む
        <ArrowRight data-icon="inline-end" />
      </Button>
    </div>
  ),
}

export const IconOnly: Story = {
  args: { purpose: 'acknowledge' },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {ICON_SIZES.map((size) => (
        <Button key={size} {...args} size={size} aria-label="内容を確認する">
          <Info />
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
        story: '同意・危険な処理への同意・拒否のどれも、明示的な type="submit" と組み合わせられる。type="button" の拒否や確認は送信しない。',
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
          setLastAction('意思を送信しました')
        }}
      >
        <div className="flex flex-wrap gap-2">
          <Button {...args} purpose="agree" type="submit">同意して送信する</Button>
          <Button {...args} purpose="agree-to-risk" type="submit">危険性に同意して送信する</Button>
          <Button {...args} purpose="decline" type="submit">拒否して送信する</Button>
          <Button {...args} purpose="decline" type="button" onClick={() => setLastAction('拒否しました')}>
            拒否する
          </Button>
          <Button {...args} purpose="acknowledge" type="button" onClick={() => setLastAction('確認しました')}>
            確認しました
          </Button>
        </div>
        <p role="status" className="text-sm text-muted-foreground">
          送信回数: {submissions} / 最後の操作: {lastAction}
        </p>
      </form>
    )
  },
}
