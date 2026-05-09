import { useEffect, useState } from 'react'
import { useCurrentUser } from '@/store/auth.store'
import { getApiErrorMessage } from '@/lib/axios'
import { ovaFilesService } from '../services/ova-files.service'
import type { PhaseSlug } from '@/features/dashboard/types/dashboard.types'
import type { OvaFileResponse } from '../types/ova-files.types'

interface Args {
  idOVA: string | undefined
  /** Si se da, solo carga archivos de esa fase. Si no, todos del OVA. */
  fase?: PhaseSlug
  /** Para subir: idEstudiante dueño del OVA (para que el backend lo guarde) */
  idEstudiante?: string
}

/**
 * Hook que maneja TODA la lógica de archivos para una fase de un OVA:
 *  - Carga inicial
 *  - Subir
 *  - Borrar
 *  - Estados de loading/uploading/error por separado
 */
export function useOvaFiles({ idOVA, fase, idEstudiante }: Args) {
  const user = useCurrentUser()
  const [files, setFiles] = useState<OvaFileResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar archivos
  useEffect(() => {
    if (!idOVA) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset al cambiar de fase/OVA
    setIsLoading(true)
    setError(null)
    const promise = fase
      ? ovaFilesService.listByPhase(idOVA, fase)
      : ovaFilesService.listByOva(idOVA)
    promise
      .then((data) => {
        if (!cancelled) setFiles(data)
      })
      .catch(() => {
        if (!cancelled) setFiles([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [idOVA, fase])

  /**
   * Sube un archivo.
   * Permisos cliente: solo el dueño del OVA (estudiante) sube.
   * El backend igual puede validar más estrictamente.
   */
  const upload = async (file: File) => {
    if (!idOVA) {
      setError('No hay OVA seleccionado')
      return
    }
    const ownerId = idEstudiante ?? user?.id
    if (!ownerId) {
      setError('Falta identificar al estudiante')
      return
    }
    setIsUploading(true)
    setError(null)
    try {
      const created = await ovaFilesService.upload({
        file,
        idOVA,
        idEstudiante: ownerId,
        idFase: fase,
      })
      // Insertamos al principio (orden createdAt desc igual al backend)
      setFiles((prev) => [created, ...prev])
    } catch (err) {
      setError(getApiErrorMessage(err, 'No se pudo subir el archivo'))
    } finally {
      setIsUploading(false)
    }
  }

  /**
   * Borra un archivo del backend + R2.
   * Optimistic update: lo quitamos de la UI inmediatamente; si falla, lo regresamos.
   */
  const remove = async (idFile: string) => {
    const previous = files
    setFiles((prev) => prev.filter((f) => f._id !== idFile))
    try {
      await ovaFilesService.remove(idFile)
    } catch (err) {
      setError(getApiErrorMessage(err, 'No se pudo eliminar el archivo'))
      setFiles(previous) // rollback
    }
  }

  return { files, isLoading, isUploading, error, upload, remove }
}
