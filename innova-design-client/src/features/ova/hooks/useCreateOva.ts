import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ovaService } from '@/features/ova/services/ova.service'
import { useCurrentUser } from '@/store/auth.store'
import { getApiErrorMessage } from '@/lib/axios'
import type { CreateOvaFormValues } from '@/features/ova/schemas/ova.schemas'

/**
 * Hook de creación de OVA. Inyecta el idEstudiante del usuario logueado,
 * llama al backend y navega a la fase de Análisis tras éxito.
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
      navigate(`/ova/${ova._id}/fase/analisis`)
    } catch (err) {
      setError(getApiErrorMessage(err, 'No se pudo crear el OVA'))
    } finally {
      setIsLoading(false)
    }
  }

  return { submit, isLoading, error }
}
