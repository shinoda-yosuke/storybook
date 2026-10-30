import { useRef, useState, type ReactElement } from 'react'

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
import { Checkbox } from '@/elements/checkbox'

type CheckboxConfirmDialogProps = {
  open: boolean
  children: [
    ReactElement<ConfirmationDialogSectionProps, typeof CheckboxConfirmDialogHeader>,
    ReactElement<ConfirmationDialogSectionProps, typeof CheckboxConfirmDialogContent>,
  ]
  checkboxLabel: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

function CheckboxConfirmDialog({
  open,
  children,
  checkboxLabel,
  confirmLabel = '次へ',
  cancelLabel = 'キャンセル',
  onConfirm,
  onCancel,
}: CheckboxConfirmDialogProps) {
  const [checked, setChecked] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  assertConfirmationDialogParts(
    children,
    CheckboxConfirmDialogHeader,
    CheckboxConfirmDialogContent,
    'CheckboxConfirmDialog',
  )

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
        ref={contentRef}
        showCloseButton={false}
        initialFocus={() =>
          contentRef.current?.querySelector<HTMLElement>('[data-slot="dialog-title"]') ?? true
        }
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto"
      >
        {children}
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

function CheckboxConfirmDialogHeader({ children }: ConfirmationDialogSectionProps) {
  return (
    <BaseDialogHeader>
      <BaseDialogTitle tabIndex={-1} className={confirmationDialogTitleClassName}>
        {children}
      </BaseDialogTitle>
    </BaseDialogHeader>
  )
}

function CheckboxConfirmDialogContent({ children }: ConfirmationDialogSectionProps) {
  return (
    <div className="min-w-0 overflow-x-auto text-sm text-muted-foreground">
      {children}
    </div>
  )
}

CheckboxConfirmDialogHeader.displayName = 'CheckboxConfirmDialogHeader'
CheckboxConfirmDialogContent.displayName = 'CheckboxConfirmDialogContent'

export {
  CheckboxConfirmDialog,
  CheckboxConfirmDialogHeader,
  CheckboxConfirmDialogContent,
  type CheckboxConfirmDialogProps,
}
