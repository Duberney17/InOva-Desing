import { z } from 'zod'

/**
 * Reglas de validación. Reflejan EXACTAMENTE las del backend
 * (LoginDto y RegisterDto) — así no nos pisamos.
 *
 *   email: formato válido
 *   password: mínimo 6 caracteres
 *   name: mínimo 2 caracteres (no vacío)
 *   rol: enum 'docente' | 'estudiante'
 */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es obligatorio')
    .email('Correo electrónico inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(80, 'El nombre es demasiado largo'),
    email: z
      .string()
      .min(1, 'El correo es obligatorio')
      .email('Correo electrónico inválido'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    rol: z.enum(['docente', 'estudiante'], {
      message: 'Selecciona un rol',
    }),
    /**
     * Código del docente (opcional, solo aplica para estudiantes).
     * Por ahora es el _id de Mongo del docente (24 chars hex).
     * El backend valida que exista; aquí solo aceptamos el formato.
     */
    idDocente: z
      .string()
      .trim()
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      // Si es estudiante y mete un código, debe verse como un ObjectId Mongo
      if (data.rol === 'estudiante' && data.idDocente && data.idDocente.length > 0) {
        return /^[a-f\d]{24}$/i.test(data.idDocente)
      }
      return true
    },
    {
      message: 'El código debe ser un identificador válido (24 caracteres hex)',
      path: ['idDocente'],
    },
  )

export type RegisterFormValues = z.infer<typeof registerSchema>
