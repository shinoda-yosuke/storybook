import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Plus, Trash2 } from 'lucide-react'

import { Button, buttonVariants } from '@/elements/button'

type ButtonProps = ComponentProps<typeof Button>

const VARIANTS = [
  'default',
  'outline',
  'secondary',
  'ghost',
  'destructive',
  'link',
] as const satisfies readonly NonNullable<ButtonProps['variant']>[]

const TEXT_SIZES = ['xs', 'sm', 'default', 'lg'] as const satisfies readonly NonNullable<
  ButtonProps['size']
>[]

const ICON_SIZES = ['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const satisfies readonly NonNullable<
  ButtonProps['size']
>[]

const SIZES = [...TEXT_SIZES, ...ICON_SIZES]

const meta = {
  title: 'Elements/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'いちばん小さい部品のボタン。shadcn/ui（Base UI・nova）のボタンをそのまま使う。リンクにはボタンを使わず、`buttonVariants` でリンクに見た目だけを当てる。',
      },
    },
  },
  args: {
    children: 'ボタン',
    variant: 'default',
    size: 'default',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
      description: '見た目の種類',
      table: { type: { summary: VARIANTS.join(' | ') } },
    },
    size: {
      control: 'select',
      options: SIZES,
      description: '大きさ。icon で始まるものは、アイコンだけのボタンに使う',
      table: { type: { summary: SIZES.join(' | ') } },
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {TEXT_SIZES.map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
}

export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args}>
        <Plus data-icon="inline-start" />
        追加
      </Button>
      <Button {...args} variant="outline">
        次へ
        <ArrowRight data-icon="inline-end" />
      </Button>
    </div>
  ),
}

export const IconOnly: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {ICON_SIZES.map((size) => (
        <Button key={size} {...args} size={size} variant="outline" aria-label="削除">
          <Trash2 />
        </Button>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const AsLink: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'リンクはボタンにせず、TanStack Router の `Link` に `buttonVariants` で見た目だけを当てる。Base UI のボタンを `render` でリンクにすると `role="button"` が付き、リンクとして読み上げられなくなるため。',
      },
    },
  },
  render: ({ variant, size }) => (
    <Link to="/" className={buttonVariants({ variant, size })}>
      トップへ
    </Link>
  ),
}
