import { useRef, type ReactElement, type ReactNode } from 'react'

import {
  _BaseDialog,
  _BaseDialogClose,
  _BaseDialogContent,
  _BaseDialogFooter,
  _BaseDialogHeader,
  _BaseDialogTitle,
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
  pending?: boolean
  error?: ReactNode
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({
  open,
  children,
  confirmLabel = '確認',
  cancelLabel = 'キャンセル',
  pending = false,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  assertConfirmationDialogParts(children, ConfirmDialogHeader, ConfirmDialogContent, 'ConfirmDialog')

  return (
    <_BaseDialog
      open={open}
      disablePointerDismissal
      onOpenChange={(nextOpen, eventDetails) => {
        if (!nextOpen) {
          if (pending) eventDetails.cancel()
          else onCancel()
        }
      }}
    >
      <_BaseDialogContent
        ref={contentRef}
        showCloseButton={false}
        initialFocus={() =>
          contentRef.current?.querySelector<HTMLElement>('[data-slot="dialog-title"]') ?? true
        }
        finalFocus
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto"
      >
        {children}
        {error != null && typeof error !== 'boolean' && (
          <div role="alert" className="text-sm text-destructive">{error}</div>
        )}
        {pending && (
          <p role="status" className="text-sm text-muted-foreground">処理中です。完了するまでお待ちください。</p>
        )}
        <_BaseDialogFooter>
          <_BaseDialogClose disabled={pending} render={<Button purpose="decline" />}>
            {cancelLabel}
          </_BaseDialogClose>
          <Button
            purpose="agree"
            disabled={pending}
            aria-busy={pending}
            onClick={() => {
              if (!pending) onConfirm()
            }}
          >
            {pending ? '処理中…' : confirmLabel}
          </Button>
        </_BaseDialogFooter>
      </_BaseDialogContent>
    </_BaseDialog>
  )
}

function ConfirmDialogHeader({ children }: ConfirmationDialogSectionProps) {
  return (
    <_BaseDialogHeader>
      <_BaseDialogTitle tabIndex={-1} className={confirmationDialogTitleClassName}>
        {children}
      </_BaseDialogTitle>
    </_BaseDialogHeader>
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
