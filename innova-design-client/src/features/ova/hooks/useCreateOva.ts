import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ovaService } from '@/features/ova/services/ova.service'
import { useCurrentUser } from '@/store/auth.store'
import { getApiErrorMessage } from '@/lib/axios'
import type { CreateOvaFormValues } from '@/features/ova/schemas/ova.schemas'

/**
 * Hook que encapsula el flujo de "crear OVA":
 *   1. Toma title + description del form
 *   2. Inyecta idEstudiante del usuario logueado (Zustand)
 *   3. Llama al backend POST /ovas
 *   4. Si va bien → navega a la fase Análisis del nuevo OVA
 *   5. Si falla → expone el error
 *
 * Por separación de responsabilidades, el modal/UI no conoce ni axios ni
 * react-router. Solo llama a `submit(values)` y reacciona a `isLoading`/`error`.
 */
export function useCreateOva(onSuccess?: () => void) {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (values: CreateOvaFormValues) => {
    if (!user?.id) {
      setError('No hay sesión activa')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const ova = await ovaService.createOva({
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        idEstudiante: user.id,
      })
      onSuccess?.()
      // Llevamos al usuario directo a la primera fase del OVA recién creado.
      navigate(`/ova/${ova._id}/fase/analisis`)
    } catch (err) {
      setError(getApiErrorMessage(err, 'No se pudo crear el OVA'))
    } finally {
      setIsLoading(false)
    }
  }

  return { submit, isLoading, error }
}
