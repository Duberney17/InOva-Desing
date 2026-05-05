import { forwardRef, useId } from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, rows = 4, ...rest }, ref) => {
    const id = useId()
    const errorId = `${id}-error`

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-medium text-stone-700">
          {label}
        </label>
        {hint && <p className="text-xs text-stone-400">{hint}</p>}
        <textarea
          id={id}
          ref={ref}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={[
            'w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400',
            'focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            error
              ? 'border-red-400 ring-1 ring-red-300'
              : 'border-stone-200 hover:border-stone-300',
          ].join(' ')}
          {...rest}
        />
        {error && (
          <p id={errorId} className="text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'
