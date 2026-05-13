import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Ova, OvaStatus } from '../types/dashboard.types'
import { PhaseStep } from './PhaseStep'
import { DeleteOvaModal } from '@/features/ova/components/DeleteOvaModal'

interface OvaActiveCardProps {
  ova: Ova
  /** Se llama cuando el usuario elimina este OVA — para refrescar la lista. */
  onDeleted?: () => void
}

const STATUS_LABEL: Record<OvaStatus, string> = {
  en_progreso: 'En progreso',
  completado:  'Completado',
  revisado:    'Finalizado',
  borrador:    'Borrador',
}

const STATUS_BADGE: Record<OvaStatus, string> = {
  en_progreso: 'bg-amber-50 text-amber-700 ring-amber-200',
  completado:  'bg-brand-50 text-brand-700 ring-brand-200',
  revisado:    'bg-purple-50 text-purple-700 ring-purple-200',
  borrador:    'bg-stone-50 text-stone-600 ring-stone-200',
}

export function OvaActiveCard({ ova, onDeleted }: OvaActiveCardProps) {
  const navigate = useNavigate()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 ring-1 ring-brand-200">
            OVA Activo
          </span>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS_BADGE[ova.status]}`}>
          {STATUS_LABEL[ova.status]}
        </span>
      </div>

      <h2 className="text-xl font-bold text-stone-800">{ova.title}</h2>
      <p className="mt-1 text-sm text-stone-500">Creado el {ova.createdAt}</p>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-sm text-stone-500">Progreso global</span>
          <span className="text-sm font-semibold text-brand-600">{ova.progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${ova.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {ova.phases.map((phase) => (
          <PhaseStep key={phase.slug} phase={phase} ovaId={ova.id} />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              const current = ova.phases.find((p) => p.status === 'in_progress') ?? ova.phases[0]
              navigate(`/ova/${ova.id}/fase/${current.slug}`)
            }}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Continuar OVA
          </button>
          <button
            type="button"
            onClick={() => navigate(`/ova/${ova.id}/preview`)}
            className="rounded-lg bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-200"
          >
            Vista previa
          </button>
        </div>
        <button
          type="button"
          onClick={() => setIsDeleteOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4z" clipRule="evenodd" />
          </svg>
          Eliminar OVA
        </button>
      </div>

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
