import { useEffect, useId, useRef, type FormEvent, type ReactNode } from 'react'

import { Button } from '@/elements/button'

type _BaseLoginFormProps = {
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  pending?: boolean
  error?: ReactNode
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function _BaseLoginForm({
  title,
  description,
  children,
  pending = false,
  error,
  onSubmit,
}: _BaseLoginFormProps) {
  const id = useId()
  const errorRef = useRef<HTMLDivElement>(null)
  const submitted = useRef(false)
  const hasError = error != null && typeof error !== 'boolean'

  useEffect(() => {
    if (submitted.current && hasError && !pending) {
      errorRef.current?.focus()
      submitted.current = false
    }
  }, [error, hasError, pending])

  return (
    <section data-slot="login-form" className="grid gap-6 rounded-2xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
      <header className="grid gap-2">
        <h1 id={`${id}-title`} className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p id={`${id}-description`} className="text-sm leading-relaxed text-muted-foreground">{description}</p>}
      </header>
      <form
        aria-labelledby={`${id}-title`}
        aria-describedby={description ? `${id}-description` : undefined}
        className="grid gap-5"
        onSubmit={(event) => {
          event.preventDefault()
          if (!pending) {
            submitted.current = true
            onSubmit(event)
          }
        }}
      >
        <fieldset disabled={pending} className="grid min-w-0 gap-5">
          {children}
        </fieldset>
        {hasError && (
          <div ref={errorRef} role="alert" tabIndex={-1} className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-[color-mix(in_oklch,var(--destructive),var(--foreground)_25%)] outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            {error}
          </div>
        )}
        <Button purpose="agree" type="submit" size="lg" width="fill" disabled={pending} aria-busy={pending}>
          {pending ? 'ログイン中…' : 'ログイン'}
        </Button>
        {pending && <p role="status" className="text-sm text-muted-foreground">ログインしています。しばらくお待ちください。</p>}
      </form>
    </section>
  )
}

_BaseLoginForm.displayName = '_BaseLoginForm'

export { _BaseLoginForm, type _BaseLoginFormProps }
