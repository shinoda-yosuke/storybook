import type { ReactNode } from 'react'

type OneTwoSplitLayoutProps = {
  start: ReactNode
  end: ReactNode
}

function OneTwoSplitLayout({ start, end }: OneTwoSplitLayoutProps) {
  return (
    <div className="@container min-w-0">
      <div className="grid min-w-0 grid-cols-1 gap-4 @min-[48rem]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="min-w-0">{start}</div>
        <div className="min-w-0">{end}</div>
      </div>
    </div>
  )
}

OneTwoSplitLayout.displayName = 'OneTwoSplitLayout'

export { OneTwoSplitLayout, type OneTwoSplitLayoutProps }
