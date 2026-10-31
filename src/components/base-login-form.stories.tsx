import { useId } from 'react'
import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { fn } from 'storybook/test'

import { _BaseLoginForm } from '@/components/base-login-form'
import { TextInput } from '@/elements/text-input'

const meta = {
  title: 'Components/LoginForm/_BaseLoginForm',
  component: _BaseLoginForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'ログインフォームの派生実装用の土台。見出し・説明・入力領域を受け取り、送信・処理中の操作制限・エラー表示とフォーカスを共通化する。画面や Page Sample では入力方法を固定した派生を使う。',
      },
    },
  },
  args: {
    title: 'ログイン',
    description: '派生で定義した入力項目をここに組み込みます。',
    onSubmit: fn(),
    children: <TextInput aria-label="ユーザー名" name="username" autoComplete="username" required />,
  },
  argTypes: {
    children: { control: false },
    onSubmit: { control: false },
    error: { control: 'text' },
  },
  render: function Render(args) {
    const id = useId()
    return (
      <div className="w-full max-w-sm">
        <_BaseLoginForm {...args}>
          <div className="grid gap-2">
            <label htmlFor={id} className="text-sm font-medium">ユーザー名</label>
            <TextInput id={id} name="username" autoComplete="username" required />
          </div>
        </_BaseLoginForm>
      </div>
    )
  },
} satisfies Meta<typeof _BaseLoginForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { name: '基本' }
export const Pending: Story = { name: '完了まで待たせる', args: { pending: true } }
export const WithError: Story = { name: '失敗を伝えて再試行させる', args: { error: 'ログインできませんでした。入力内容を確認して、もう一度お試しください。' } }
