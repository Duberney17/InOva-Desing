import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ovaService } from '@/features/ova/services/ova.service'
import { useCurrentUser } from '@/store/auth.store'
import { getApiErrorMessage } from '@/lib/axios'

/**
 * Hook que encapsula el "reiniciar OVA":
 *  1. Llama al endpoint PATCH /user-progress/.../reset
 *  2. En éxito: navega a /ova/:id/fase/analisis (la primera fase)
 *  3. La key del form en OvaPhasePage cambiará automáticamente porque
 *     savedData volverá a null en el siguiente fetch.
 *
 * NOTA: el endpoint backend resetea el progreso pero NO borra los datos
 * de cada fase (analysis-phase, design-phase, etc.). Si quisieras una
 * "limpieza total", habría que añadir endpoints DELETE por fase. Eso es
 * decisión de diseño que dejamos al usuario.
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
      await ovaService.resetProgress(ovaId, user.id)
      // Navegar fuerza un nuevo fetch en OvaPhasePage por el effect de [phaseSlug]
      navigate(`/ova/${ovaId}/fase/analisis`, { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err, 'No se pudo reiniciar el OVA'))
    } finally {
      setIsLoading(false)
    }
  }

  return { reset, isLoading, error }
}
