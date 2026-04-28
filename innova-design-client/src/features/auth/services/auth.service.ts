import { api } from '@/lib/axios'
import type { User } from '@/types/user'
import type {
  LoginFormValues,
  RegisterFormValues,
} from '@/features/auth/schemas/auth.schemas'

/**
 * Shape exacto de la respuesta del backend para /auth/login y /auth/register.
 * Si el backend cambia, este es el lugar a actualizar — la UI no se entera.
 */
export interface AuthResponse {
  access_token: string
  user: User
}

/**
 * Service de autenticación.
 *
 * Notas:
 *  - Devolvemos `data` directamente, no la respuesta cruda de Axios.
 *  - Los errores se propagan; el caller (hook) decide qué hacer.
 */
export const authService = {
  async login(payload: LoginFormValues): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload)
    return data
  },

  async register(payload: RegisterFormValues): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload)
    return data
  },
}
