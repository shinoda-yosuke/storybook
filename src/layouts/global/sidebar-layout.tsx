import type { ReactNode } from 'react'

type SidebarLayoutProps = {
  sidebar: ReactNode
  header: ReactNode
  children: ReactNode
}

function SidebarLayout({ sidebar, header, children }: SidebarLayoutProps) {
  return (
    <div className="grid min-h-dvh grid-cols-1 grid-rows-[auto_auto_1fr] md:grid-cols-[16rem_minmax(0,1fr)] md:grid-rows-[auto_1fr]">
      <div className="min-w-0 md:col-start-2 md:row-start-1">{header}</div>
      <div className="min-w-0 md:col-start-1 md:row-span-2 md:row-start-1">{sidebar}</div>
      <div className="min-h-0 min-w-0 md:col-start-2 md:row-start-2">{children}</div>
    </div>
  )
}

SidebarLayout.displayName = 'SidebarLayout'

export { SidebarLayout, type SidebarLayoutProps }
