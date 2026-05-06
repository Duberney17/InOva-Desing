import { Link } from 'react-router-dom'
import type { Ova } from '../types/dashboard.types'
import type { PhaseSlug } from '../types/dashboard.types'

interface OvaListItemProps {
  ova: Ova
  /** Slug de la fase a la que apunta el link (por defecto la activa o analisis) */
  resumeSlug?: PhaseSlug
}

const STATUS_LABEL: Record<Ova['status'], string> = {
  en_progreso: 'En progreso',
  completado:  'Completado',
  revisado:    'Revisado',
  borrador:    'Borrador',
}

const STATUS_BADGE: Record<Ova['status'], string> = {
  en_progreso: 'bg-amber-50 text-amber-700 ring-amber-200',
  completado:  'bg-brand-50 text-brand-700 ring-brand-200',
  revisado:    'bg-purple-50 text-purple-700 ring-purple-200',
  borrador:    'bg-stone-50 text-stone-600 ring-stone-200',
}

/**
 * Item compacto de OVA en la lista lateral del dashboard estudiante.
 * Muestra título, estado, % de progreso, y al hacer click navega
 * a la fase actual del OVA.
 */
export function OvaListItem({ ova, resumeSlug = 'analisis' }: OvaListItemProps) {
  return (
    <Link
      to={`/ova/${ova.id}/fase/${resumeSlug}`}
      className="block rounded-xl border border-stone-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-stone-800">{ova.title}</p>
          <p className="mt-0.5 text-xs text-stone-500">{ova.createdAt}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ${STATUS_BADGE[ova.status]}`}
        >
          {STATUS_LABEL[ova.status]}
        </span>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>{ova.completedPhases}/{ova.totalPhases} fases</span>
          <span className="font-semibold text-brand-700">{ova.progress}%</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all"
            style={{ width: `${ova.progress}%` }}
          />
        </div>
      </div>
    </Link>
  )
}
