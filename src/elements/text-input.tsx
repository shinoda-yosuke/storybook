import type { ComponentProps } from 'react'

type TextInputProps = Omit<
  ComponentProps<'input'>,
  'className' | 'style' | 'color' | 'type' | 'children' | 'dangerouslySetInnerHTML'
> & {
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url'
}

function TextInput({ type = 'text', ...props }: TextInputProps) {
  return (
    <input
      {...props}
      type={type}
      data-slot="text-input"
      className="h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-base text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
    />
  )
}

TextInput.displayName = 'TextInput'

export { TextInput, type TextInputProps }
