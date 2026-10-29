import { useRef, useState, type ReactNode } from 'react'

import {
  BaseDialog,
  BaseDialogClose,
  BaseDialogContent,
  BaseDialogFooter,
  BaseDialogHeader,
  BaseDialogTitle,
} from '@/components/base-dialog'
import { Button } from '@/elements/button'
import { Checkbox } from '@/elements/checkbox'

type CheckboxConfirmDialogProps = {
  open: boolean
  title: string
  children: ReactNode
  checkboxLabel: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

function CheckboxConfirmDialog({
  open,
  title,
  children,
  checkboxLabel,
  confirmLabel = '次へ',
  cancelLabel = 'キャンセル',
  onConfirm,
  onCancel,
}: CheckboxConfirmDialogProps) {
  const [checked, setChecked] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)

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
        <label className="flex cursor-pointer items-start gap-2 text-sm leading-5">
          <Checkbox checked={checked} onCheckedChange={setChecked} className="mt-0.5" />
          {checkboxLabel}
        </label>
        <BaseDialogFooter>
          <BaseDialogClose render={<Button variant="outline" />}>
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
