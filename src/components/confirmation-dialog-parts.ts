import { isValidElement, type ComponentType, type ReactNode } from 'react'

type ConfirmationDialogSectionProps = {
  children: ReactNode
}

const confirmationDialogTitleClassName =
  'leading-snug outline-none [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:font-normal'

function assertConfirmationDialogParts(
  children: unknown,
  Header: ComponentType<ConfirmationDialogSectionProps>,
  Content: ComponentType<ConfirmationDialogSectionProps>,
  name: string,
) {
  // JSX の型だけでは子要素の種類を区別できないため、実行時にも構成を確認する。
  if (
    !Array.isArray(children) ||
    children.length !== 2 ||
    !isValidElement(children[0]) ||
    children[0].type !== Header ||
    !isValidElement(children[1]) ||
    children[1].type !== Content
  ) {
    throw new Error(`${name} には ${name}Header と ${name}Content をこの順で1つずつ渡してください。`)
  }
}

export {
  assertConfirmationDialogParts,
  confirmationDialogTitleClassName,
  type ConfirmationDialogSectionProps,
}
