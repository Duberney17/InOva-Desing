import { api } from '@/lib/axios'
import type { PhaseSlug } from '@/features/dashboard/types/dashboard.types'
import type { OvaFileResponse } from '../types/ova-files.types'

interface UploadArgs {
  file: File
  idOVA: string
  idEstudiante: string
  idFase?: PhaseSlug
}

/**
 * Service de archivos del OVA.
 *
 * NOTA importante sobre uploads:
 * Para enviar archivos NO usamos JSON. Usamos FormData (multipart/form-data),
 * que es lo que el backend espera con @UseInterceptors(FileInterceptor('file')).
 *
 * Axios detecta el FormData y pone el Content-Type correcto automáticamente
 * (incluyendo el boundary), por eso NO se especifica.
 */
export const ovaFilesService = {
  upload: ({ file, idOVA, idEstudiante, idFase }: UploadArgs): Promise<OvaFileResponse> => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('idOVA', idOVA)
    fd.append('idEstudiante', idEstudiante)
    if (idFase) fd.append('idFase', idFase)

    return api
      .post('/ova-files/upload', fd, {
        // Más tiempo para uploads grandes
        timeout: 60_000,
        // Forzar multipart explícitamente (axios añade el boundary correcto).
        // Defensa en profundidad por si quedó algún default global de Content-Type.
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },

  listByOva: (idOVA: string): Promise<OvaFileResponse[]> =>
    api.get(`/ova-files/ova/${idOVA}`).then((r) => r.data),

  listByPhase: (idOVA: string, idFase: PhaseSlug): Promise<OvaFileResponse[]> =>
    api.get(`/ova-files/ova/${idOVA}/fase/${idFase}`).then((r) => r.data),

  remove: (idFile: string): Promise<{ deleted: boolean; id: string }> =>
    api.delete(`/ova-files/${idFile}`).then((r) => r.data),
}
