import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ovaService } from '@/features/ova/services/ova.service'
import { useCurrentUser } from '@/store/auth.store'
import { getApiErrorMessage } from '@/lib/axios'

/**
 * Hook para reiniciar un OVA desde cero. Llama al backend que borra fases,
 * archivos, progreso y evaluaciones; luego navega a la fase de Análisis.
 */
export function useResetOva(ovaId: string) {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = async () => {
    if (!user?.id) {
      setError('No hay sesión activa')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      await ovaService.clearOva(ovaId)
      await ovaService.resetProgress(ovaId, user.id).catch(() => null)
      navigate(`/ova/${ovaId}/fase/analisis`, { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err, 'No se pudo reiniciar el OVA'))
    } finally {
      setIsLoading(false)
    }
  }

  return { reset, isLoading, error }
}
