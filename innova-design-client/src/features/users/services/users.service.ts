import { api } from '@/lib/axios'
import type { UserRole } from '@/types/user'

/**
 * Forma cruda del usuario que devuelve el backend
 * (sin password — el service ya hace `.select('-password')`).
 */
export interface UserResponse {
  _id: string
  name: string
  email: string
  rol: UserRole
  idDocente: string | null
  state: boolean
  createdAt: string
  updatedAt: string
}

export const usersService = {
  /**
   * Estudiantes vinculados a un docente.
   * Endpoint: GET /users/students/:idDocente
   */
  getStudentsByTeacher: (idDocente: string): Promise<UserResponse[]> =>
    api.get(`/users/students/${idDocente}`).then((r) => r.data),

  getById: (id: string): Promise<UserResponse> =>
    api.get(`/users/${id}`).then((r) => r.data),
}
