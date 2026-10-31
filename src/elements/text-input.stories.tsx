import { useId } from 'react'
import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { TextInput } from '@/elements/text-input'

const meta = {
  title: 'Elements/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '文字を入力するための汎用部品。type はメールアドレス・パスワードなど入力の意味を表す。HTML の入力属性・ref・aria-* を受け取り、className・style・見た目のバリアントは公開しない。label は利用側で関連付ける。',
      },
    },
  },
  args: { type: 'text', placeholder: '入力してください' },
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'search', 'tel', 'url'] },
  },
  render: function Render(args) {
    const id = useId()
    return (
      <div className="grid w-64 max-w-full gap-2">
        <label htmlFor={id} className="text-sm font-medium">入力内容</label>
        <TextInput {...args} id={id} />
      </div>
    )
  },
} satisfies Meta<typeof TextInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { name: '入力させる' }
export const Email: Story = { name: 'メールアドレスを入力させる', args: { type: 'email', autoComplete: 'email', placeholder: 'you@example.com' } }
export const Password: Story = { name: 'パスワードを入力させる', args: { type: 'password', autoComplete: 'current-password', placeholder: 'パスワード' } }
export const Disabled: Story = { name: '入力を無効にする', args: { disabled: true } }
