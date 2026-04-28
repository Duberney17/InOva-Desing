import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '@/features/auth/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { getApiErrorMessage } from '@/lib/axios'
import type { LoginFormValues } from '@/features/auth/schemas/auth.schemas'

/**
 * Hook que encapsula TODO el flujo de iniciar sesión:
 *   1. Llama al backend.
 *   2. Si va bien → guarda en el store + redirige.
 *   3. Si falla → expone el error para que la UI lo muestre.
 *
 * La UI (LoginPage) solo se preocupa por: "tengo un submit, ¿cómo va?".
 */
export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession)
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Si el usuario llegó al /login porque intentó entrar a una ruta protegida,
  // la guardamos en location.state.from. Tras el login, lo regresamos allí.
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
