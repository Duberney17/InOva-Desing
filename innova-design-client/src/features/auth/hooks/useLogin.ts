import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '@/features/auth/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { getApiErrorMessage } from '@/lib/axios'
import type { LoginFormValues } from '@/features/auth/schemas/auth.schemas'

/**
 * Hook que encapsula el flujo de iniciar sesión: llama al backend,
 * guarda la sesión en el store y redirige al dashboard (o a la ruta
 * que el usuario intentaba visitar antes de ser bloqueado por el guard).
 */
export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession)
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? '/dashboard'

  const submit = async (values: LoginFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      const { user, access_token } = await authService.login(values)
      setSession(user, access_token)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err, 'No se pudo iniciar sesión'))
    } finally {
      setIsLoading(false)
    }
  }

  return { submit, isLoading, error }
}
