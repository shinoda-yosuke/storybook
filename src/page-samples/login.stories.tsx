import { useEffect, useRef } from 'react'
import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { CircleCheck } from 'lucide-react'

import { demoLoginEmail, demoLoginPassword, useLoginExample } from '../../.storybook/use-login-example'

import { EmailPasswordLoginForm } from '@/components/email-password-login-form'
import { Button } from '@/elements/button'
import { ContentLayout } from '@/layouts/global/content-layout'

const meta = {
  id: 'page-sample-login',
  title: 'Page Sample/ログイン',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    jsx: {
      filterProps: (value: unknown, key: string) => key !== 'ref' && value !== undefined,
    },
    docs: {
      description: {
        component:
          `ContentLayout と EmailPasswordLoginForm を組み合わせたログインページ。${demoLoginEmail} / ${demoLoginPassword} で成功し、それ以外の入力ではエラーを表示して再試行できる。800msの待ち時間で処理中の状態を再現する。入力内容はサンプル内だけで扱い、認証サーバーへの通信や保存は行わない。`,
      },
      source: { type: 'dynamic' },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'ログインさせる',
  render: function Render() {
    const example = useLoginExample()
    const containerRef = useRef<HTMLDivElement>(null)
    const previousEmail = useRef<string | null>(null)

    useEffect(() => {
      if (example.loggedInEmail) {
        containerRef.current?.querySelector<HTMLElement>('h1')?.focus()
      } else if (previousEmail.current) {
        containerRef.current?.querySelector<HTMLInputElement>('input[name="email"]')?.focus()
      }
      previousEmail.current = example.loggedInEmail
    }, [example.loggedInEmail])

    return (
      <ContentLayout>
        <main className="grid min-h-dvh place-items-center bg-muted/30 px-4 py-12">
          <div ref={containerRef} className="w-full max-w-sm">
            {example.loggedInEmail ? (
              <section className="grid justify-items-center gap-4 rounded-2xl border bg-card p-6 text-center shadow-sm sm:p-8">
                <CircleCheck aria-hidden="true" className="size-10 text-foreground" />
                <h1 tabIndex={-1} className="text-2xl font-semibold outline-none">ログインしました</h1>
                <p className="break-all text-sm text-muted-foreground">{example.loggedInEmail}</p>
                <Button purpose="acknowledge" width="fill" onClick={example.reset}>ログイン画面に戻る</Button>
              </section>
            ) : (
              <EmailPasswordLoginForm pending={example.pending} error={example.error} onSubmit={example.login} />
            )}
          </div>
        </main>
      </ContentLayout>
    )
  },
}
