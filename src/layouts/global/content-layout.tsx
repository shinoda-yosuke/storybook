import type { ReactNode } from 'react'

type ContentLayoutProps = {
  children: ReactNode
}

function ContentLayout({ children }: ContentLayoutProps) {
  return <div className="min-h-dvh min-w-0">{children}</div>
}

ContentLayout.displayName = 'ContentLayout'

export { ContentLayout, type ContentLayoutProps }
