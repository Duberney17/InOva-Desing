import { useState } from 'react'
import type { Ova, EvaluationStatus } from '../types/dashboard.types'
import { DeleteOvaModal } from '@/features/ova/components/DeleteOvaModal'

interface OvaListItemProps {
  ova: Ova
  /** Si este OVA es el actualmente seleccionado como principal */
  isActive?: boolean
  /** Click → este OVA se vuelve el principal en el dashboard. */
  onSelect?: () => void
  /** Callback al eliminar — para refrescar la lista */
  onDeleted?: () => void
}

const STATUS_LABEL: Record<Ova['status'], string> = {
  en_progreso: 'En progreso',
  completado:  'Completado',
  revisado:    'Finalizado',
  borrador:    'Borrador',
}

const STATUS_BADGE: Record<Ova['status'], string> = {
  en_progreso: 'bg-amber-50 text-amber-700 ring-amber-200',
  completado:  'bg-brand-50 text-brand-700 ring-brand-200',
  revisado:    'bg-purple-50 text-purple-700 ring-purple-200',
  borrador:    'bg-stone-50 text-stone-600 ring-stone-200',
}

const EVAL_LABEL: Record<EvaluationStatus, string> = {
  pendiente: 'Evaluación pendiente',
  aprobado:  'Aprobado por docente',
  rechazado: 'Pidió ajustes',
}

const EVAL_COLOR: Record<EvaluationStatus, string> = {
  pendiente: 'text-amber-600',
  aprobado:  'text-brand-700',
  rechazado: 'text-rose-600',
}

const EVAL_DOT: Record<EvaluationStatus, string> = {
  pendiente: 'bg-amber-400',
  aprobado:  'bg-brand-500',
  rechazado: 'bg-rose-500',
}

/**
 * Item de OVA en la lista lateral del dashboard.
 * Click → ese OVA se vuelve el "principal" en el dashboard
 * (no navega: el usuario decide cuál ver en grande).
 * Para abrir/editar el OVA, se hace desde el OvaActiveCard ("Continuar OVA").
 */
export function OvaListItem({ ova, isActive, onSelect, onDeleted }: OvaListItemProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const evalStatus: EvaluationStatus = ova.teacherEvaluation ?? 'pendiente'

  return (
    <div
      className={`group relative rounded-xl border bg-white p-4 transition ${
        isActive
          ? 'border-brand-400 shadow-sm ring-1 ring-brand-300'
          : 'border-stone-200 hover:border-brand-300 hover:shadow-sm'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="block w-full text-left"
        aria-pressed={isActive}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 pr-7">
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

        {/* Evaluación del docente — siempre visible para que el estudiante sepa */}
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className={`inline-block size-1.5 rounded-full ${EVAL_DOT[evalStatus]}`} />
          <span className={`text-[11px] font-medium ${EVAL_COLOR[evalStatus]}`}>
            {EVAL_LABEL[evalStatus]}
          </span>
        </div>

        {isActive ? (
          <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700 ring-1 ring-brand-200">
            ★ Activo en el panel
          </div>
        ) : null}
      </button>

      {/* Botón eliminar — flota arriba a la derecha, solo visible al hover */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setIsDeleteOpen(true)
        }}
        title="Eliminar OVA"
        aria-label="Eliminar OVA"
        className="absolute right-2 top-2 rounded-md p-1.5 text-stone-300 opacity-0 transition group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4z" clipRule="evenodd" />
        </svg>
      </button>

      <DeleteOvaModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        ovaId={ova.id}
        ovaTitle={ova.title}
        onDeleted={onDeleted}
      />
    </div>
  )
}
