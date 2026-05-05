import { useId } from 'react'

interface CheckboxGroupProps {
  label: string
  hint?: string
  options: string[]
  value: string[]
  onChange: (val: string[]) => void
  error?: string
}

export function CheckboxGroup({ label, hint, options, value, onChange, error }: CheckboxGroupProps) {
  const id = useId()

  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option))
    } else {
      onChange([...value, option])
    }
  }

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-stone-700">{label}</legend>
      {hint && <p className="text-xs text-stone-400">{hint}</p>}

      <div className="flex flex-wrap gap-2 mt-1">
        {options.map((option) => {
          const checked = value.includes(option)
          return (
            <label
              key={option}
              className={[
                'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition',
                checked
                  ? 'border-brand-400 bg-brand-50 text-brand-700 font-medium'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300',
              ].join(' ')}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(option)}
                className="sr-only"
                aria-describedby={error ? `${id}-error` : undefined}
              />
              <span className={['size-4 rounded flex items-center justify-center shrink-0 border transition', checked ? 'bg-brand-500 border-brand-500' : 'border-stone-300'].join(' ')}>
                {checked && (
                  <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="size-3">
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                )}
              </span>
              {option}
            </label>
          )
        })}
      </div>

      {error && <p id={`${id}-error`} className="text-xs text-red-500">{error}</p>}
    </fieldset>
  )
}
