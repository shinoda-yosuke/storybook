import { useRef, type ReactElement } from 'react'

import {
  BaseDialog,
  BaseDialogClose,
  BaseDialogContent,
  BaseDialogFooter,
  BaseDialogHeader,
  BaseDialogTitle,
} from '@/components/base-dialog'
import {
  assertConfirmationDialogParts,
  confirmationDialogTitleClassName,
  type ConfirmationDialogSectionProps,
} from '@/components/confirmation-dialog-parts'
import { Button } from '@/elements/button'

type ConfirmDialogProps = {
  open: boolean
  children: [
    ReactElement<ConfirmationDialogSectionProps, typeof ConfirmDialogHeader>,
    ReactElement<ConfirmationDialogSectionProps, typeof ConfirmDialogContent>,
  ]
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({
  open,
  children,
  confirmLabel = '確認',
  cancelLabel = 'キャンセル',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  assertConfirmationDialogParts(children, ConfirmDialogHeader, ConfirmDialogContent, 'ConfirmDialog')

  return (
    <BaseDialog
      open={open}
      disablePointerDismissal
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onCancel()
      }}
    >
      <BaseDialogContent
        ref={contentRef}
        showCloseButton={false}
        initialFocus={() =>
          contentRef.current?.querySelector<HTMLElement>('[data-slot="dialog-title"]') ?? true
        }
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto"
      >
        {children}
        <BaseDialogFooter>
          <BaseDialogClose render={<Button purpose="cancel" />}>
            {cancelLabel}
          </BaseDialogClose>
          <Button purpose="execute" onClick={onConfirm}>{confirmLabel}</Button>
        </BaseDialogFooter>
      </BaseDialogContent>
    </BaseDialog>
  )
}

function ConfirmDialogHeader({ children }: ConfirmationDialogSectionProps) {
  return (
    <BaseDialogHeader>
      <BaseDialogTitle tabIndex={-1} className={confirmationDialogTitleClassName}>
        {children}
      </BaseDialogTitle>
    </BaseDialogHeader>
  )
}

function ConfirmDialogContent({ children }: ConfirmationDialogSectionProps) {
  return (
    <div className="min-w-0 overflow-x-auto text-sm text-muted-foreground">
      {children}
    </div>
  )
}

ConfirmDialogHeader.displayName = 'ConfirmDialogHeader'
ConfirmDialogContent.displayName = 'ConfirmDialogContent'

export { ConfirmDialog, ConfirmDialogHeader, ConfirmDialogContent, type ConfirmDialogProps }
