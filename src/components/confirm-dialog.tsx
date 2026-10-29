import { useRef } from 'react'

import {
  BaseDialog,
  BaseDialogClose,
  BaseDialogContent,
  BaseDialogDescription,
  BaseDialogFooter,
  BaseDialogHeader,
  BaseDialogTitle,
} from '@/components/base-dialog'
import { Button } from '@/elements/button'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = '確認',
  cancelLabel = 'キャンセル',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

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
        initialFocus={cancelRef}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto"
      >
        <BaseDialogHeader>
          <BaseDialogTitle>{title}</BaseDialogTitle>
          <BaseDialogDescription>{description}</BaseDialogDescription>
        </BaseDialogHeader>
        <BaseDialogFooter>
          <BaseDialogClose render={<Button ref={cancelRef} variant="outline" />}>
            {cancelLabel}
          </BaseDialogClose>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </BaseDialogFooter>
      </BaseDialogContent>
    </BaseDialog>
  )
}

export { ConfirmDialog, type ConfirmDialogProps }
