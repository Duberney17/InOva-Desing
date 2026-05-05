import { useId } from 'react'

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  label: string
  options: RadioOption[]
  value: string
  onChange: (val: string) => void
  error?: string
}

export function RadioGroup({ label, options, value, onChange, error }: RadioGroupProps) {
  const id = useId()

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-stone-700">{label}</legend>

      <div className="flex flex-col gap-2 mt-1">
        {options.map((opt) => {
          const selected = value === opt.value
          return (
            <label
              key={opt.value}
              className={[
                'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition',
                selected
                  ? 'border-brand-400 bg-brand-50'
                  : 'border-stone-200 bg-white hover:border-stone-300',
              ].join(' ')}
            >
              <input
                type="radio"
                value={opt.value}
                checked={selected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <span className={['mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition', selected ? 'border-brand-500' : 'border-stone-300'].join(' ')}>
                {selected && <span className="size-2 rounded-full bg-brand-500" />}
              </span>
              <div>
                <p className={['text-sm font-medium', selected ? 'text-brand-700' : 'text-stone-700'].join(' ')}>{opt.label}</p>
                {opt.description && <p className="text-xs text-stone-400 mt-0.5">{opt.description}</p>}
              </div>
            </label>
          )
        })}
      </div>

      {error && <p id={`${id}-error`} className="text-xs text-red-500">{error}</p>}
    </fieldset>
  )
}
