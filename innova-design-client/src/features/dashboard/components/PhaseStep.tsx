import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { OvaPhase } from '../types/dashboard.types'

const PHASE_ICONS: Record<string, ReactNode> = {
  analisis: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-6">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  diseno: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-6">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  desarrollo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-6">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  implementacion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-6">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  evaluacion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-6">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4"  />
      <line x1="6"  y1="20" x2="6"  y2="14" />
    </svg>
  ),
}

const STATUS_STYLES = {
  completed:   'bg-brand-50 text-brand-700 ring-1 ring-brand-200 cursor-pointer hover:bg-brand-100',
  in_progress: 'bg-white text-brand-700 ring-2 ring-brand-500 cursor-pointer hover:bg-brand-50',
  pending:     'bg-stone-100 text-stone-400 ring-1 ring-stone-200 cursor-default',
}

interface PhaseStepProps {
  phase: OvaPhase
  ovaId: string
}

export function PhaseStep({ phase, ovaId }: PhaseStepProps) {
  const navigate = useNavigate()
  const isClickable = phase.status !== 'pending'

  const handleClick = () => {
    if (isClickable) navigate(`/ova/${ovaId}/fase/${phase.slug}`)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isClickable}
      className={[
        'flex flex-col items-center gap-2 rounded-xl p-3 transition-all min-w-[90px]',
        STATUS_STYLES[phase.status],
      ].join(' ')}
    >
      <span className="relative">
        {PHASE_ICONS[phase.slug]}
        {phase.status === 'in_progress' && (
          <span className="absolute -right-1 -top-1 flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-brand-500" />
          </span>
        )}
        {phase.status === 'completed' && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-brand-500 text-white">
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="size-2.5">
              <path d="M2 6l3 3 5-5" />
            </svg>
          </span>
        )}
      </span>
      <span className="text-xs font-medium leading-tight">{phase.label}</span>
      <span className={[
        'text-[10px] font-semibold uppercase tracking-wide',
        phase.status === 'completed'   ? 'text-brand-600' :
        phase.status === 'in_progress' ? 'text-brand-500' :
        'text-stone-400',
      ].join(' ')}>
        {phase.status === 'completed'   ? 'Completado'  :
         phase.status === 'in_progress' ? 'En curso →'  :
         'Pendiente'}
      </span>
    </button>
  )
}
