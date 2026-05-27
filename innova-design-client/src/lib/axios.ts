import axios, { AxiosError } from 'axios'
import { env } from '@/lib/env'

/**
 * Cliente HTTP único de la app.
 *
 * IMPORTANTE: no declaramos Content-Type por defecto — axios lo elige según
 * el tipo de body (JSON, FormData, URLSearchParams). Forzarlo rompe uploads.
 */
export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
})

// Inyectar JWT en cada request. Leemos directo del localStorage para evitar
// el ciclo store → axios → store.
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('inova-auth')
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as {
        state?: { accessToken?: string | null }
      }
      const token = parsed.state?.accessToken
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`)
      }
    } catch {
      // token corrupto: ignoramos
    }
  }
  return config
})

// Logout automático si el backend responde 401.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('inova-auth')
      const onAuthScreen =
        window.location.pathname.startsWith('/login') ||
        window.location.pathname.startsWith('/register')
      if (!onAuthScreen) {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

/**
 * Extrae el mensaje de error legible que envía NestJS.
 * Shape: { statusCode, message, error } donde message puede ser string o string[].
 */
export function getApiErrorMessage(err: unknown, fallback = 'Algo salió mal'): string {
  if (err instanceof AxiosError) {
    const data = err.response?.data as
      | { message?: string | string[] }
      | undefined
    const msg = data?.message
    if (Array.isArray(msg)) return msg.join(', ')
    if (typeof msg === 'string') return msg
    return err.message || fallback
  }
  return fallback
}
