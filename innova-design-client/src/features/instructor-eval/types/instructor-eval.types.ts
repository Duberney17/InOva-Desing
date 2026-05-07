import type { PhaseSlug } from '@/features/dashboard/types/dashboard.types'

/**
 * Posibles estados de una evaluación.
 * Reflejan el enum del backend.
 */
export type EvalEstado = 'pendiente' | 'aprobado' | 'rechazado'

/**
 * Forma cruda que devuelve el backend (sin transformación).
 */
export interface InstructorEvalResponse {
  _id: string
  idOVA: string
  idEstudiante: string
  idDocente: string
  fase: PhaseSlug
  estado: EvalEstado
  observaciones: string
  createdAt: string
  updatedAt: string
}

/**
 * Payload para crear una evaluación nueva.
 */
export interface CreateInstructorEvalPayload {
  idOVA: string
  idEstudiante: string
  idDocente: string
  fase: PhaseSlug
  estado: EvalEstado
  observaciones: string
}

/**
 * Payload para actualizar una evaluación existente
 * (todos los campos opcionales gracias a PartialType en el backend).
 */
export type UpdateInstructorEvalPayload = Partial<
  Omit<CreateInstructorEvalPayload, 'idOVA' | 'idEstudiante' | 'idDocente' | 'fase'>
>
