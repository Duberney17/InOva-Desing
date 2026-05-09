import { useId, useRef, useState } from 'react'

interface FileUploadButtonProps {
  onUpload: (file: File) => void | Promise<void>
  isUploading?: boolean
  /** mimes aceptados separados por coma. Por defecto: PDFs, imágenes, doc, xls, ppt. */
  accept?: string
  /** Tamaño máximo en MB (validación cliente, además del backend). */
  maxSizeMB?: number
}

const DEFAULT_ACCEPT =
  'application/pdf,image/jpeg,image/png,image/webp,image/gif,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain'

/**
 * Botón "Subir archivo" con soporte de drag & drop.
 *
 * Patrón: usamos un <input type="file" hidden> y el botón visible es un wrapper
 * que dispara el click del input. Mucho más fácil de estilar.
 */
export function FileUploadButton({
  onUpload,
  isUploading,
  accept = DEFAULT_ACCEPT,
  maxSizeMB = 10,
}: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const [isDragging, setIsDragging] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`Máximo ${maxSizeMB} MB. Este archivo pesa ${(file.size / 1024 / 1024).toFixed(1)} MB`)
      return
    }
    setLocalError(null)
    await onUpload(file)
    if (inputRef.current) inputRef.current.value = '' // permitir subir el mismo archivo dos veces
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          if (!isUploading) void handleFiles(e.dataTransfer.files)
        }}
        className={`flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-5 text-sm transition ${
          isDragging
            ? 'border-brand-400 bg-brand-50'
            : 'border-stone-300 bg-white hover:border-brand-300 hover:bg-brand-50/40'
        } ${isUploading ? 'cursor-wait opacity-70' : ''}`}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          hidden
          disabled={isUploading}
          onChange={(e) => void handleFiles(e.target.files)}
        />
        {isUploading ? (
          <>
            <span className="inline-block size-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            <span className="font-medium text-stone-600">Subiendo…</span>
          </>
        ) : (
          <>
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5 text-brand-600">
              <path d="M10 2a.75.75 0 01.75.75v8.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V2.75A.75.75 0 0110 2z" />
              <path d="M3 14.75a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" />
            </svg>
            <span className="font-medium text-stone-700">
              Subir archivo o arrástralo aquí
            </span>
            <span className="text-xs text-stone-400">PDF, imagen, Word, Excel… máx {maxSizeMB} MB</span>
          </>
        )}
      </label>

      {localError ? (
        <p className="text-xs text-rose-600">{localError}</p>
      ) : null}
    </div>
  )
}
