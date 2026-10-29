import { useRef, type ReactNode } from 'react'

import {
  BaseDialog,
  BaseDialogClose,
  BaseDialogContent,
  BaseDialogFooter,
  BaseDialogHeader,
  BaseDialogTitle,
} from '@/components/base-dialog'
import { Button } from '@/elements/button'

type ConfirmDialogProps = {
  open: boolean
  title: string
  children: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = '確認',
  cancelLabel = 'キャンセル',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  return (
    <BaseDialog
      open={open}
      disablePointerDismissal
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onCancel()
      }}
    >
      <BaseDialogContent
        showCloseButton={false}
        initialFocus={titleRef}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto"
      >
        <BaseDialogHeader>
          <BaseDialogTitle ref={titleRef} tabIndex={-1} className="outline-none">
            {title}
          </BaseDialogTitle>
        </BaseDialogHeader>
        <div className="min-w-0 overflow-x-auto text-sm text-muted-foreground">
          {children}
        </div>
        <BaseDialogFooter>
          <BaseDialogClose render={<Button variant="outline" />}>
            {cancelLabel}
          </BaseDialogClose>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </BaseDialogFooter>
      </BaseDialogContent>
    </BaseDialog>
  )
}

export { ConfirmDialog, type ConfirmDialogProps }
