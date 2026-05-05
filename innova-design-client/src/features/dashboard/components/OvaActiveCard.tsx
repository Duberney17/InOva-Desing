import { useNavigate } from 'react-router-dom'
import type { Ova } from '../types/dashboard.types'
import { PhaseStep } from './PhaseStep'

interface OvaActiveCardProps {
  ova: Ova
}

export function OvaActiveCard({ ova }: OvaActiveCardProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 ring-1 ring-brand-200">
            OVA Activo
          </span>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
          En progreso
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

      <div className="mt-5 flex gap-3 border-t border-stone-100 pt-4">
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
    </div>
  )
}
