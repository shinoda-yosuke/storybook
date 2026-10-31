import { useRef, useState, type ReactElement, type ReactNode } from 'react'

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
  pending?: boolean
  error?: ReactNode
  onConfirm: () => void
  onCancel: () => void
}

function CheckboxConfirmDialog({
  open,
  children,
  checkboxLabel,
  confirmLabel = '次へ',
  cancelLabel = 'キャンセル',
  pending = false,
  error,
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
        <label className="flex cursor-pointer items-start gap-2 text-sm leading-5">
          <span className="mt-0.5 shrink-0">
            <Checkbox checked={checked} onCheckedChange={setChecked} disabled={pending} />
          </span>
          {checkboxLabel}
        </label>
        <_BaseDialogFooter>
          <_BaseDialogClose disabled={pending} render={<Button purpose="decline" />}>
            {cancelLabel}
          </_BaseDialogClose>
          <Button
            purpose="agree"
            disabled={!checked || pending}
            aria-busy={pending}
            onClick={() => {
              if (checked && !pending) onConfirm()
            }}
          >
            {pending ? '処理中…' : confirmLabel}
          </Button>
        </_BaseDialogFooter>
      </_BaseDialogContent>
    </_BaseDialog>
  )
}

function CheckboxConfirmDialogHeader({ children }: ConfirmationDialogSectionProps) {
  return (
    <_BaseDialogHeader>
      <_BaseDialogTitle tabIndex={-1} className={confirmationDialogTitleClassName}>
        {children}
      </_BaseDialogTitle>
    </_BaseDialogHeader>
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
