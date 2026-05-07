import { useEffect, useState } from 'react'
import { instructorEvalService } from '../services/instructor-eval.service'
import { getApiErrorMessage } from '@/lib/axios'
import type { PhaseSlug } from '@/features/dashboard/types/dashboard.types'
import type {
  EvalEstado,
  InstructorEvalResponse,
} from '../types/instructor-eval.types'

interface Args {
  idOVA: string | undefined
  fase: PhaseSlug | undefined
  /** El docente (para crear) — del store de auth en el caller */
  idDocente?: string
  /** El estudiante dueño del OVA (para crear) — del OVA cargado */
  idEstudiante?: string
}

/**
 * Hook que carga la evaluación existente de una fase y expone una acción
 * `submit` que hace upsert (crea o actualiza).
 *
 * Estados expuestos:
 *  - evaluation: la evaluación actual (o null)
 *  - isLoading: cargando la evaluación inicial
 *  - isSaving: guardando el upsert
 *  - error: mensaje de error en upsert
 */
export function useInstructorEval({ idOVA, fase, idDocente, idEstudiante }: Args) {
  const [evaluation, setEvaluation] = useState<InstructorEvalResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar evaluación existente
  useEffect(() => {
    if (!idOVA || !fase) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset al cambiar de fase/OVA
    setIsLoading(true)
    instructorEvalService
      .getByOvaPhase(idOVA, fase)
      .then((ev) => {
        if (!cancelled) setEvaluation(ev)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [idOVA, fase])

  /**
   * Guarda evaluación (upsert).
   * El docente puede llamar a `submit('aprobado', 'Buen trabajo')` por ejemplo.
   */
  const submit = async (estado: EvalEstado, observaciones: string) => {
    if (!idOVA || !fase || !idDocente || !idEstudiante) {
      setError('Faltan datos para guardar la evaluación')
      return
    }
    setIsSaving(true)
    setError(null)
    try {
      const result = await instructorEvalService.upsert(evaluation?._id ?? null, {
        idOVA,
        idEstudiante,
        idDocente,
        fase,
        estado,
        observaciones,
      })
      setEvaluation(result)
    } catch (err) {
      setError(getApiErrorMessage(err, 'No se pudo guardar la evaluación'))
    } finally {
      setIsSaving(false)
    }
  }

  return { evaluation, isLoading, isSaving, error, submit }
}
