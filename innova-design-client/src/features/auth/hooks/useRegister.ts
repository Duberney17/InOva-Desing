import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/features/auth/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { getApiErrorMessage } from '@/lib/axios'
import type { RegisterFormValues } from '@/features/auth/schemas/auth.schemas'

/**
 * Hook de registro. Tras crear la cuenta, deja al usuario logueado
 * y lo manda al dashboard — el backend devuelve el access_token en
 * la misma respuesta, así no hace falta un segundo round-trip.
 */
export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (values: RegisterFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      // string vacío → undefined (el backend prefiere undefined a "")
      const payload: RegisterFormValues = {
        ...values,
        idDocente:
          values.idDocente && values.idDocente.trim().length > 0
            ? values.idDocente.trim()
            : undefined,
      }
      const { user, access_token } = await authService.register(payload)
      setSession(user, access_token)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err, 'No se pudo crear la cuenta'))
    } finally {
      setIsLoading(false)
    }
  }

  return { submit, isLoading, error }
}
