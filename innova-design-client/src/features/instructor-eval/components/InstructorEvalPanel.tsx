import { useEffect, useState } from 'react'
import { useCurrentUser } from '@/store/auth.store'
import { useInstructorEval } from '../hooks/useInstructorEval'
import { EvaluationStatusBadge } from './EvaluationStatusBadge'
import type { PhaseSlug } from '@/features/dashboard/types/dashboard.types'
import type { EvalEstado } from '../types/instructor-eval.types'

interface InstructorEvalPanelProps {
  idOVA: string
  fase: PhaseSlug
  /** ID del estudiante dueño del OVA — necesario para crear evaluación si no existe. */
  idEstudiante: string
}

/**
 * Panel que ve EL DOCENTE para evaluar una fase del estudiante.
 *
 * Estado:
 *  - Si nunca ha evaluado: estado=pendiente, observaciones vacías, botones Aprobar/Rechazar.
 *  - Si ya evaluó: muestra estado actual + observaciones, permite editar/cambiar estado.
 */
export function InstructorEvalPanel({ idOVA, fase, idEstudiante }: InstructorEvalPanelProps) {
  const user = useCurrentUser()
  const { evaluation, isLoading, isSaving, error, submit } = useInstructorEval({
    idOVA,
    fase,
    idDocente: user?.id,
    idEstudiante,
  })

  const [observaciones, setObservaciones] = useState('')
  const [savedFlash, setSavedFlash] = useState(false)

  // Sincronizar el textarea con la evaluación cuando llega del backend
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync con datos async
    setObservaciones(evaluation?.observaciones ?? '')
  }, [evaluation])

  const handleAction = async (estado: EvalEstado) => {
    await submit(estado, observaciones)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 2500)
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <svg className="size-4 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Cargando evaluación…
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <header className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">Tu evaluación</h3>
          <p className="mt-0.5 text-xs text-stone-500">
            Aprueba o pide ajustes con una observación.
          </p>
        </div>
        {evaluation ? <EvaluationStatusBadge estado={evaluation.estado} /> : null}
      </header>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-stone-600">
            Observaciones para el estudiante
          </span>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={4}
            placeholder="Ej: Profundiza en los conocimientos previos, falta detallar el público objetivo…"
            className="w-full resize-none rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>

        {error ? (
          <div
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700"
          >
            {error}
          </div>
        ) : null}

        {savedFlash ? (
          <div className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-xs text-brand-700">
            ¡Evaluación guardada!
          </div>
        ) : null}

        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => handleAction('rechazado')}
            disabled={isSaving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L10 8.94l3.47-3.47a.75.75 0 111.06 1.06L11.06 10l3.47 3.47a.75.75 0 11-1.06 1.06L10 11.06l-3.47 3.47a.75.75 0 01-1.06-1.06L8.94 10 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
            Pedir ajustes
          </button>
          <button
            type="button"
            onClick={() => handleAction('aprobado')}
            disabled={isSaving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
            )}
            {evaluation?.estado === 'aprobado' ? 'Reaprobar' : 'Aprobar'}
          </button>
        </div>
      </div>
    </div>
  )
}
