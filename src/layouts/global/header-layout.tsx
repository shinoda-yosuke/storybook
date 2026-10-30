import type { ReactNode } from 'react'

type HeaderLayoutProps = {
  header: ReactNode
  children: ReactNode
}

function HeaderLayout({ header, children }: HeaderLayoutProps) {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr]">
      <div className="min-w-0">{header}</div>
      <div className="min-h-0 min-w-0">{children}</div>
    </div>
  )
}

HeaderLayout.displayName = 'HeaderLayout'

export { HeaderLayout, type HeaderLayoutProps }
