import { useRef, useState } from 'react'

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
import { Checkbox } from '@/elements/checkbox'

type CheckboxConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  checkboxLabel: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

function CheckboxConfirmDialog({
  open,
  title,
  description,
  checkboxLabel,
  confirmLabel = '次へ',
  cancelLabel = 'キャンセル',
  onConfirm,
  onCancel,
}: CheckboxConfirmDialogProps) {
  const [checked, setChecked] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)

  // 親から閉じた場合も、次に開くときは未チェックから始める。
  if (!open && checked) {
    setChecked(false)
  }

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
        <label className="flex cursor-pointer items-start gap-2 text-sm leading-5">
          <Checkbox checked={checked} onCheckedChange={setChecked} className="mt-0.5" />
          {checkboxLabel}
        </label>
        <BaseDialogFooter>
          <BaseDialogClose render={<Button ref={cancelRef} variant="outline" />}>
            {cancelLabel}
          </BaseDialogClose>
          <Button
            disabled={!checked}
            onClick={() => {
              if (checked) onConfirm()
            }}
          >
            {confirmLabel}
          </Button>
        </BaseDialogFooter>
      </BaseDialogContent>
    </BaseDialog>
  )
}

export { CheckboxConfirmDialog, type CheckboxConfirmDialogProps }
