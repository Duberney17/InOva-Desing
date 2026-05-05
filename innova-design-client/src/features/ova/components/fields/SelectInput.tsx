import { useId } from 'react'

interface SelectInputProps {
  label: string
  hint?: string
  options: string[]
  value: string
  onChange: (val: string) => void
  error?: string
}

export function SelectInput({ label, hint, options, value, onChange, error }: SelectInputProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-stone-700">{label}</label>
      {hint && <p className="text-xs text-stone-400">{hint}</p>}

      <div className="relative">
        <select
          id={id}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={[
            'w-full appearance-none rounded-xl border bg-white px-4 py-3 pr-10 text-sm text-stone-800 outline-none transition',
            'focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            error
              ? 'border-red-400 ring-1 ring-red-300'
              : 'border-stone-200 hover:border-stone-300',
            !value ? 'text-stone-400' : '',
          ].join(' ')}
        >
          <option value="" disabled>Selecciona una opción</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </span>
      </div>

      {error && <p id={errorId} className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
