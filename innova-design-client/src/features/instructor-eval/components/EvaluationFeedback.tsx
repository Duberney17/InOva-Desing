import { useEffect, useState } from 'react'
import { instructorEvalService } from '../services/instructor-eval.service'
import { EvaluationStatusBadge } from './EvaluationStatusBadge'
import type { PhaseSlug } from '@/features/dashboard/types/dashboard.types'
import type { InstructorEvalResponse } from '../types/instructor-eval.types'

interface EvaluationFeedbackProps {
  idOVA: string
  fase: PhaseSlug
}

/**
 * Banner que ve EL ESTUDIANTE arriba del formulario.
 *
 * Solo se renderiza si:
 *  1. Existe evaluación para la fase
 *  2. El estado NO es 'pendiente' (si está pendiente, no hay nada que mostrar)
 *
 * Visual:
 *  - aprobado → fondo verde, ícono check
 *  - rechazado → fondo rosa, ícono X, observación bien visible
 */
export function EvaluationFeedback({ idOVA, fase }: EvaluationFeedbackProps) {
  const [evaluation, setEvaluation] = useState<InstructorEvalResponse | null>(null)

  useEffect(() => {
    let cancelled = false
    instructorEvalService.getByOvaPhase(idOVA, fase).then((ev) => {
      if (!cancelled) setEvaluation(ev)
    })
    return () => {
      cancelled = true
    }
  }, [idOVA, fase])

  if (!evaluation || evaluation.estado === 'pendiente') return null

  const isApproved = evaluation.estado === 'aprobado'
  const fechaActualizacion = new Date(evaluation.updatedAt).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div
      className={`mb-5 rounded-xl border p-4 ${
        isApproved
          ? 'border-brand-200 bg-brand-50/60'
          : 'border-rose-200 bg-rose-50/60'
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p
            className={`text-sm font-semibold ${
              isApproved ? 'text-brand-800' : 'text-rose-800'
            }`}
          >
            Retroalimentación de tu docente
          </p>
          <EvaluationStatusBadge estado={evaluation.estado} size="sm" />
        </div>
        <p className="text-[10px] text-stone-500">{fechaActualizacion}</p>
      </div>

      {evaluation.observaciones ? (
        <p
          className={`whitespace-pre-wrap text-sm leading-relaxed ${
            isApproved ? 'text-brand-900/80' : 'text-rose-900/80'
          }`}
        >
          {evaluation.observaciones}
        </p>
      ) : (
        <p
          className={`text-sm italic ${
            isApproved ? 'text-brand-700/70' : 'text-rose-700/70'
          }`}
        >
          Sin observaciones adicionales.
        </p>
      )}
    </div>
  )
}
