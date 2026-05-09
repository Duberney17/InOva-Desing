import type { PhaseSlug } from '@/features/dashboard/types/dashboard.types'

/**
 * Forma cruda que devuelve el backend para un archivo subido.
 */
export interface OvaFileResponse {
  _id: string
  idOVA: string
  idEstudiante: string
  idFase: PhaseSlug | null
  originalName: string
  storageKey: string
  url: string
  mimeType: string
  size: number
  createdAt: string
  updatedAt: string
}
