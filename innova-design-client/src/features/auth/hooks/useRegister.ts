import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/features/auth/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { getApiErrorMessage } from '@/lib/axios'
import type { RegisterFormValues } from '@/features/auth/schemas/auth.schemas'

/**
 * Hook análogo a useLogin pero para registro.
 *
 * Decisión de diseño: tras un registro exitoso, dejamos al usuario
 * automáticamente logueado y lo mandamos al dashboard. (El backend
 * ya devuelve el access_token en /auth/register, así que no hace
 * falta un segundo round-trip pidiéndole login.)
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
      const { user, access_token } = await authService.register(values)
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
