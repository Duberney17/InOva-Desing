import axios, { AxiosError } from 'axios'
import { env } from '@/lib/env'

/**
 * Cliente HTTP único de la app.
 *
 * Patrón: una sola instancia configurada que se importa donde sea necesaria.
 * Nunca llamamos a `axios` directamente desde un service; siempre `api`.
 * Así, cualquier cambio de configuración (baseURL, headers, timeouts) ocurre
 * en un único lugar.
 */
export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Interceptor de REQUEST ──────────────────────────────────────────────
// Se ejecuta antes de enviar cada petición. Aquí inyectamos el JWT si existe.
//
// ¿Por qué leemos el token desde localStorage en vez de importar el store?
// Porque importar el store de Zustand desde aquí crearía un ciclo de
// dependencias (store → axios → store). Leer la "fuente de verdad" persistida
// es más simple y evita el ciclo.
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
      // Token corrupto: lo ignoramos en silencio.
    }
  }
  return config
})

// ─── Interceptor de RESPONSE ─────────────────────────────────────────────
// Si el backend responde 401 (token vencido o inválido), limpiamos la
// sesión y mandamos al usuario al /login. Es el "logout automático".
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('inova-auth')
      // Solo redirigimos si NO estamos ya en una pantalla de auth,
      // para no romper el formulario de login con un error de credenciales.
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
 * Helper para extraer el mensaje de error legible que envía NestJS.
 * NestJS responde con shape: { statusCode, message, error }
 * donde `message` puede ser string o string[] (validación class-validator).
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
