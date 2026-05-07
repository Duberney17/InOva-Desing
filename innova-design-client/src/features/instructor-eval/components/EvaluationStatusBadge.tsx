import type { EvalEstado } from '../types/instructor-eval.types'

interface EvaluationStatusBadgeProps {
  estado: EvalEstado
  size?: 'sm' | 'md'
}

const STYLES: Record<EvalEstado, { bg: string; label: string; icon: string }> = {
  aprobado: {
    bg: 'bg-brand-50 text-brand-700 ring-brand-200',
    label: 'Aprobado',
    icon: 'M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z',
  },
  rechazado: {
    bg: 'bg-rose-50 text-rose-700 ring-rose-200',
    label: 'Necesita ajustes',
    icon: 'M5.47 5.47a.75.75 0 011.06 0L10 8.94l3.47-3.47a.75.75 0 111.06 1.06L11.06 10l3.47 3.47a.75.75 0 11-1.06 1.06L10 11.06l-3.47 3.47a.75.75 0 01-1.06-1.06L8.94 10 5.47 6.53a.75.75 0 010-1.06z',
  },
  pendiente: {
    bg: 'bg-amber-50 text-amber-700 ring-amber-200',
    label: 'Pendiente',
    icon: 'M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .2.08.39.22.53l3 3a.75.75 0 101.06-1.06l-2.78-2.78V5z',
  },
}

/**
 * Badge visual reutilizable que muestra el estado de una evaluación.
 */
export function EvaluationStatusBadge({ estado, size = 'md' }: EvaluationStatusBadgeProps) {
  const s = STYLES[estado]
  const sizing =
    size === 'sm'
      ? 'gap-1 px-2 py-0.5 text-[10px]'
      : 'gap-1.5 px-2.5 py-1 text-xs'
  const iconSize = size === 'sm' ? 'size-3' : 'size-3.5'

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ring-1 ${s.bg} ${sizing}`}
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconSize}>
        <path fillRule="evenodd" d={s.icon} clipRule="evenodd" />
      </svg>
      {s.label}
    </span>
  )
}
