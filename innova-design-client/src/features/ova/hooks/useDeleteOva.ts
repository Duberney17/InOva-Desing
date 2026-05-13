import { useState } from 'react'
import { ovaService } from '@/features/ova/services/ova.service'
import { getApiErrorMessage } from '@/lib/axios'

/**
 * Hook para eliminar un OVA por completo (cascade delete).
 *
 * Recibe un callback onSuccess para que el caller refresque su lista
 * o navegue a otro lado tras la eliminación exitosa.
 */
export function useDeleteOva(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remove = async (idOVA: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await ovaService.deleteOvaFull(idOVA)
      onSuccess?.()
    } catch (err) {
      setError(getApiErrorMessage(err, 'No se pudo eliminar el OVA'))
    } finally {
      setIsLoading(false)
    }
  }

  return { remove, isLoading, error }
}
