import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

/** Input con label, hint y mensaje de error integrados. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className, ...rest },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hasError = Boolean(error)

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-slate-800"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined
        }
        className={`h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-2 focus:ring-offset-0 ${
          hasError
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
            : 'border-slate-200 focus:border-brand-500 focus:ring-brand-200'
        } ${className ?? ''}`}
        {...rest}
      />
      {hasError ? (
        <span id={`${inputId}-err`} className="text-xs text-rose-600">
          {error}
        </span>
      ) : hint ? (
        <span id={`${inputId}-hint`} className="text-xs text-slate-500">
          {hint}
        </span>
      ) : null}
    </div>
  )
})
