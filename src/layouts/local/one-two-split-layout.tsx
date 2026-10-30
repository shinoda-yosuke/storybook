import type { ReactNode } from 'react'

type OneTwoSplitLayoutProps = {
  start: ReactNode
  end: ReactNode
}

function OneTwoSplitLayout({ start, end }: OneTwoSplitLayoutProps) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div className="min-w-0">{start}</div>
      <div className="min-w-0">{end}</div>
    </div>
  )
}

OneTwoSplitLayout.displayName = 'OneTwoSplitLayout'

export { OneTwoSplitLayout, type OneTwoSplitLayoutProps }
