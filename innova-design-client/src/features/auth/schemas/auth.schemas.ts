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

export const registerSchema = z.object({
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
})

export type RegisterFormValues = z.infer<typeof registerSchema>
