/**
 * Modelo del usuario tal como lo devuelve el backend en /auth/login y
 * /auth/register (sin password, claro).
 */
export type UserRole = 'docente' | 'estudiante'

export interface User {
  id: string
  name: string
  email: string
  rol: UserRole
  idDocente: string | null
}
