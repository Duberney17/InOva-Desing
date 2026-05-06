import { z } from 'zod'

/**
 * Schema para crear un OVA. Refleja el CreateOvaDto del backend.
 *  - title: requerido, mínimo 5
 *  - description: opcional, máximo 280
 */
export const createOvaSchema = z.object({
  title: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(120, 'Máximo 120 caracteres'),
  description: z
    .string()
    .max(280, 'Máximo 280 caracteres')
    .optional()
    .or(z.literal('')),
})

export type CreateOvaFormValues = z.infer<typeof createOvaSchema>
