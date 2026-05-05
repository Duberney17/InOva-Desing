import { useNavigate } from 'react-router-dom'
import { PHASES } from '../types/ova.types'
import type { PhaseSlug } from '@/features/dashboard/types/dashboard.types'

interface PhaseNavProps {
  ovaId: string
  currentSlug: PhaseSlug
}

export function PhaseNav({ ovaId, currentSlug }: PhaseNavProps) {
  const navigate = useNavigate()

  return (
    <nav className="flex flex-col gap-1">
      {PHASES.map((phase, idx) => {
        const isCurrent = phase.slug === currentSlug
        return (
          <button
            key={phase.slug}
            type="button"
            onClick={() => navigate(`/ova/${ovaId}/fase/${phase.slug}`)}
            className={[
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition',
              isCurrent
                ? 'bg-brand-50 text-brand-700 font-semibold ring-1 ring-brand-200'
                : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700',
            ].join(' ')}
          >
            <span className={[
              'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
              isCurrent ? 'bg-brand-600 text-white' : 'bg-stone-200 text-stone-500',
            ].join(' ')}>
              {idx + 1}
            </span>
            <span className="text-sm">{phase.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
