import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { fn } from 'storybook/test'

import { EmailPasswordLoginForm } from '@/components/email-password-login-form'

const meta = {
  title: 'Components/LoginForm/EmailPasswordLoginForm',
  component: EmailPasswordLoginForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '_BaseLoginForm を包み、メールアドレスとパスワードの必須入力に絞った派生。ラベル・入力方法・autocomplete・送信ボタンを固定する。onSubmit に入力値を渡し、認証処理・pending・error は呼び出し側が管理する。処理中は入力と再送信を止め、失敗時は内容を保持してエラーへフォーカスする。ページ全体の使用例は Page Sample / ログインを参照。',
      },
    },
  },
  args: { onSubmit: fn() },
  argTypes: {
    onSubmit: { control: false, description: '必須入力とメール形式の検証後、email と password を受け取る' },
    pending: { control: 'boolean', description: '親が管理する処理中の状態' },
    error: { control: 'text', description: '親が管理するエラー。任意の ReactNode を表示する' },
  },
  render: (args) => <div className="w-full max-w-sm"><EmailPasswordLoginForm {...args} /></div>,
} satisfies Meta<typeof EmailPasswordLoginForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { name: 'メールアドレスとパスワードでログインさせる' }
export const Pending: Story = { name: '完了まで待たせる', args: { pending: true } }
export const WithError: Story = { name: '失敗を伝えて再試行させる', args: { error: 'メールアドレスまたはパスワードが正しくありません。' } }
