import { api } from '@/lib/axios'
import type { User } from '@/types/user'
import type {
  LoginFormValues,
  RegisterFormValues,
} from '@/features/auth/schemas/auth.schemas'

export interface AuthResponse {
  access_token: string
  user: User
}

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
