import { useEffect, useRef, useState } from 'react'

import type { EmailPasswordCredentials } from '@/components/email-password-login-form'

export const demoLoginEmail = 'demo@example.com'
export const demoLoginPassword = 'storybook-demo'

export function useLoginExample() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current)
  }, [])

  function login({ email, password }: EmailPasswordCredentials) {
    if (timer.current !== null) return
    setPending(true)
    setError(null)

    timer.current = setTimeout(() => {
      timer.current = null
      setPending(false)
      if (email.toLowerCase() === demoLoginEmail && password === demoLoginPassword) {
        setLoggedInEmail(demoLoginEmail)
      } else {
        setError('メールアドレスまたはパスワードが正しくありません。')
      }
    }, 800)
  }

  function reset() {
    setLoggedInEmail(null)
    setError(null)
  }

  return { pending, error, loggedInEmail, login, reset }
}
