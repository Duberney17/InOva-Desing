import { api } from '@/lib/axios'
import type { PhaseSlug } from '@/features/dashboard/types/dashboard.types'
import type {
  CreateInstructorEvalPayload,
  InstructorEvalResponse,
  UpdateInstructorEvalPayload,
} from '../types/instructor-eval.types'

/**
 * Service de evaluaciones del docente.
 *
 * NOTAS:
 *  - El backend devuelve el endpoint findByOvaAndFase como un OBJETO
 *    cuando existe y posiblemente null/array vacío cuando no. Lo
 *    normalizamos aquí para que el caller siempre reciba `evaluation | null`.
 */
export const instructorEvalService = {
  /**
   * Devuelve la evaluación de UNA fase específica de un OVA, o null si no existe.
   * Endpoint: GET /instructor-eval/ova/:idOVA/fase/:fase
   */
  getByOvaPhase: async (
    idOVA: string,
    fase: PhaseSlug,
  ): Promise<InstructorEvalResponse | null> => {
    try {
      const { data } = await api.get(`/instructor-eval/ova/${idOVA}/fase/${fase}`)
      // El backend puede devolver null, array o el objeto
      if (!data) return null
      if (Array.isArray(data)) return data[0] ?? null
      // Si el objeto es un wrapper sin _id, también null
      if (typeof data === 'object' && '_id' in data) return data as InstructorEvalResponse
      return null
    } catch {
      return null
    }
  },

  /**
   * Lista TODAS las evaluaciones de un OVA (todas las fases).
   * Útil para el estudiante: ver feedback de todas las fases en su dashboard.
   * Endpoint: GET /instructor-eval/ova/:idOVA
   */
  getByOva: async (idOVA: string): Promise<InstructorEvalResponse[]> => {
    try {
      const { data } = await api.get(`/instructor-eval/ova/${idOVA}`)
      return Array.isArray(data) ? data : []
    } catch {
      return []
    }
  },

  create: (payload: CreateInstructorEvalPayload): Promise<InstructorEvalResponse> =>
    api.post('/instructor-eval', payload).then((r) => r.data),

  update: (
    id: string,
    payload: UpdateInstructorEvalPayload,
  ): Promise<InstructorEvalResponse> =>
    api.patch(`/instructor-eval/${id}`, payload).then((r) => r.data),

  /**
   * "Upsert" — si existe, actualiza; si no, crea.
   * Patrón cómodo para el panel del docente.
   */
  upsert: async (
    existingId: string | null,
    payload: CreateInstructorEvalPayload,
  ): Promise<InstructorEvalResponse> => {
    if (existingId) {
      return instructorEvalService.update(existingId, {
        estado: payload.estado,
        observaciones: payload.observaciones,
      })
    }
    return instructorEvalService.create(payload)
  },
}
