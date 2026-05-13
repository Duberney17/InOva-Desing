import { api } from '@/lib/axios'
import type {
  AnalysisFormValues,
  DesignFormValues,
  DevelopmentFormValues,
  ImplementationFormValues,
  EvaluationFormValues,
} from '../schemas/phase.schemas'
import type { PhaseSlug } from '@/features/dashboard/types/dashboard.types'

// ─── Tipos de respuesta del backend ──────────────────────────────────────────

export interface OvaResponse {
  _id: string
  title: string
  description: string
  idEstudiante: string
  state: 'en_progreso' | 'completado' | 'revisado'
  createdAt: string
  updatedAt: string
}

export interface UserProgressResponse {
  _id: string
  idOVA: string
  idEstudiante: string
  fasesCompletadas: PhaseSlug[]
  faseActual: PhaseSlug
  porcentaje: number
}

export interface CreateOvaPayload {
  title: string
  description?: string
  idEstudiante: string
}

// ─── Mapa de slugs de fase → ruta del endpoint ───────────────────────────────

const PHASE_ENDPOINT: Record<PhaseSlug, string> = {
  analisis:       'analysis-phase',
  diseno:         'design-phase',
  desarrollo:     'development-phase',
  implementacion: 'implentation-phase',
  evaluacion:     'evaluation-phase',
}

// ─── OVAs ────────────────────────────────────────────────────────────────────

export const ovaService = {
  createOva: (payload: CreateOvaPayload): Promise<OvaResponse> =>
    api.post('/ovas', payload).then((r) => r.data),

  getStudentOvas: (idEstudiante: string): Promise<OvaResponse[]> =>
    api.get(`/ovas/student/${idEstudiante}`).then((r) => r.data),

  getOva: (id: string): Promise<OvaResponse> =>
    api.get(`/ovas/${id}`).then((r) => r.data),

  // ─── Fases ADDIE ─────────────────────────────────────────────────────────

  getPhaseData: (slug: PhaseSlug, idOVA: string): Promise<Record<string, unknown> | null> =>
    api
      .get(`/${PHASE_ENDPOINT[slug]}/ova/${idOVA}`)
      .then((r) => (Array.isArray(r.data) ? r.data[0] ?? null : r.data ?? null))
      .catch(() => null),

  savePhaseData: (
    slug: PhaseSlug,
    idOVA: string,
    data: AnalysisFormValues | DesignFormValues | DevelopmentFormValues | ImplementationFormValues | EvaluationFormValues,
    existingId?: string,
  ): Promise<Record<string, unknown>> => {
    const endpoint = PHASE_ENDPOINT[slug]
    if (existingId) {
      return api.patch(`/${endpoint}/${existingId}`, data).then((r) => r.data)
    }
    return api.post(`/${endpoint}`, { idOVA, ...data }).then((r) => r.data)
  },

  // ─── Progreso ─────────────────────────────────────────────────────────────

  getProgress: (idOVA: string, idEstudiante: string): Promise<UserProgressResponse | null> =>
    api
      .get(`/user-progress/ova/${idOVA}/student/${idEstudiante}`)
      .then((r) => r.data ?? null)
      .catch(() => null),

  completarFase: (idOVA: string, idEstudiante: string, fase: PhaseSlug): Promise<UserProgressResponse> =>
    api
      .patch(`/user-progress/ova/${idOVA}/student/${idEstudiante}/completar`, { fase })
      .then((r) => r.data),

  resetProgress: (idOVA: string, idEstudiante: string): Promise<UserProgressResponse> =>
    api
      .patch(`/user-progress/ova/${idOVA}/student/${idEstudiante}/reset`, {})
      .then((r) => r.data),

  /**
   * Reset PROFUNDO: borra los datos de las 5 fases + progreso + archivos
   * (mantiene el OVA y las evaluaciones del docente).
   */
  clearOva: (idOVA: string): Promise<{ message: string }> =>
    api.patch(`/ovas/${idOVA}/clear`).then((r) => r.data),

  /**
   * Eliminar OVA y TODO lo relacionado (5 fases, progreso, evaluaciones, archivos).
   * Operación irreversible.
   */
  deleteOvaFull: (idOVA: string): Promise<{ message: string }> =>
    api.delete(`/ovas/${idOVA}/full`).then((r) => r.data),
}
