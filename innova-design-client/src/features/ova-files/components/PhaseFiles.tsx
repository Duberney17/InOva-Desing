import { useOvaFiles } from '../hooks/useOvaFiles'
import { FileUploadButton } from './FileUploadButton'
import { FilesList } from './FilesList'
import type { PhaseSlug } from '@/features/dashboard/types/dashboard.types'

interface PhaseFilesProps {
  idOVA: string
  fase: PhaseSlug
  /** Quién puede subir/borrar. Para docente: false. Para estudiante dueño: true. */
  canEdit: boolean
  /** ID del estudiante dueño del OVA — necesario para que el backend lo guarde. */
  idEstudiante: string
}

/**
 * Sección "Archivos de esta fase" que se mete en OvaPhasePage.
 *
 * - Estudiante dueño: ve la lista + botón subir + puede borrar.
 * - Docente: ve solo la lista (modo lectura).
 */
export function PhaseFiles({ idOVA, fase, canEdit, idEstudiante }: PhaseFilesProps) {
  const { files, isLoading, isUploading, error, upload, remove } = useOvaFiles({
    idOVA,
    fase,
    idEstudiante,
  })

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">Archivos de esta fase</h3>
          <p className="mt-0.5 text-xs text-stone-500">
            {canEdit
              ? 'Adjunta documentos, imágenes o evidencias para esta fase.'
              : 'Material que el estudiante adjuntó a esta fase.'}
          </p>
        </div>
        {!isLoading && files.length > 0 ? (
          <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
            {files.length}
          </span>
        ) : null}
      </header>

      <div className="flex flex-col gap-3">
        {canEdit && (
          <FileUploadButton onUpload={upload} isUploading={isUploading} />
        )}

        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <p className="text-xs text-stone-400">Cargando archivos…</p>
        ) : (
          <FilesList files={files} canDelete={canEdit} onDelete={remove} />
        )}
      </div>
    </section>
  )
}
