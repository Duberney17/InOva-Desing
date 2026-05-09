import { useState } from 'react'
import type { OvaFileResponse } from '../types/ova-files.types'

interface FilesListProps {
  files: OvaFileResponse[]
  /** Si el caller permite borrar (estudiante dueño = sí, docente = no). */
  canDelete?: boolean
  onDelete?: (idFile: string) => void | Promise<void>
}

/**
 * Devuelve un emoji según el mime type. Sin librerías, sin sprites.
 */
function iconFor(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType === 'application/pdf') return '📕'
  if (mimeType.includes('word')) return '📘'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📗'
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📙'
  if (mimeType.startsWith('text/')) return '📄'
  return '📎'
}

/** Convierte bytes a "1.2 MB" / "350 KB" / "12 B". */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function FilesList({ files, canDelete = false, onDelete }: FilesListProps) {
  if (files.length === 0) {
    return (
      <p className="rounded-lg bg-stone-50 px-4 py-3 text-center text-xs text-stone-400">
        Aún no hay archivos en esta sección.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {files.map((file) => (
        <FileRow key={file._id} file={file} canDelete={canDelete} onDelete={onDelete} />
      ))}
    </ul>
  )
}

function FileRow({
  file,
  canDelete,
  onDelete,
}: {
  file: OvaFileResponse
  canDelete?: boolean
  onDelete?: (idFile: string) => void | Promise<void>
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleDelete = async () => {
    if (!onDelete) return
    setIsDeleting(true)
    await onDelete(file._id)
    setIsDeleting(false)
  }

  const isImage = file.mimeType.startsWith('image/')

  return (
    <li className="group flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-3 transition hover:border-stone-300">
      {/* Preview / ícono */}
      {isImage ? (
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-12 shrink-0 overflow-hidden rounded-lg bg-stone-100"
        >
          <img src={file.url} alt={file.originalName} className="size-full object-cover" />
        </a>
      ) : (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-2xl">
          {iconFor(file.mimeType)}
        </div>
      )}

      {/* Metadata + link descarga */}
      <div className="min-w-0 flex-1">
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate text-sm font-medium text-stone-800 hover:text-brand-700 hover:underline"
          title={file.originalName}
        >
          {file.originalName}
        </a>
        <p className="mt-0.5 text-xs text-stone-500">
          {formatSize(file.size)} ·{' '}
          {new Date(file.createdAt).toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Acciones */}
      <div className="flex shrink-0 items-center gap-1">
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          title="Abrir / descargar"
          aria-label="Abrir o descargar archivo"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
            <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
          </svg>
        </a>

        {canDelete ? (
          confirmOpen ? (
            <div className="flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-1.5 py-1">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
              >
                {isDeleting ? '…' : 'Sí, borrar'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded px-1.5 py-0.5 text-[11px] font-medium text-stone-600 hover:bg-white"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="rounded-md p-2 text-stone-400 transition hover:bg-rose-50 hover:text-rose-600"
              title="Eliminar archivo"
              aria-label="Eliminar archivo"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
              </svg>
            </button>
          )
        ) : null}
      </div>
    </li>
  )
}
