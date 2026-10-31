import { useId, type ReactNode } from 'react'

import { _BaseLoginForm } from '@/components/base-login-form'
import { TextInput } from '@/elements/text-input'

type EmailPasswordCredentials = {
  email: string
  password: string
}

type EmailPasswordLoginFormProps = {
  pending?: boolean
  error?: ReactNode
  onSubmit: (credentials: EmailPasswordCredentials) => void
}

function EmailPasswordLoginForm({ pending = false, error, onSubmit }: EmailPasswordLoginFormProps) {
  const id = useId()

  return (
    <_BaseLoginForm
      title="ログイン"
      description="アカウント情報を入力してください。"
      pending={pending}
      error={error}
      onSubmit={(event) => {
        const data = new FormData(event.currentTarget)
        onSubmit({
          email: String(data.get('email') ?? '').trim(),
          password: String(data.get('password') ?? ''),
        })
      }}
    >
      <div className="grid gap-2">
        <label htmlFor={`${id}-email`} className="text-sm font-medium">メールアドレス</label>
        <TextInput
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor={`${id}-password`} className="text-sm font-medium">パスワード</label>
        <TextInput id={`${id}-password`} name="password" type="password" autoComplete="current-password" required />
      </div>
    </_BaseLoginForm>
  )
}

EmailPasswordLoginForm.displayName = 'EmailPasswordLoginForm'

export { EmailPasswordLoginForm, type EmailPasswordLoginFormProps, type EmailPasswordCredentials }
