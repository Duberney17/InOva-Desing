import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useDeleteOva } from '@/features/ova/hooks/useDeleteOva'

interface DeleteOvaModalProps {
  open: boolean
  onClose: () => void
  ovaId: string
  ovaTitle: string
  /** Se llama tras eliminar exitosamente — útil para refrescar la lista. */
  onDeleted?: () => void
}

/**
 * Modal de confirmación para eliminar un OVA por COMPLETO.
 *
 * UX importante:
 *  - Botón confirmar en ROJO (acción destructiva irreversible).
 *  - Pide al usuario que ESCRIBA el título del OVA para confirmar
 *    (patrón "type to confirm" usado por GitHub, Vercel, etc.) →
 *    evita borrados accidentales.
 */
export function DeleteOvaModal({
  open,
  onClose,
  ovaId,
  ovaTitle,
  onDeleted,
}: DeleteOvaModalProps) {
  const [confirmText, setConfirmText] = useState('')
  const { remove, isLoading, error } = useDeleteOva(() => {
    setConfirmText('')
    onDeleted?.()
    onClose()
  })

  const isMatch = confirmText.trim() === ovaTitle.trim()

  const handleClose = () => {
    if (isLoading) return
    setConfirmText('')
    onClose()
  }

  const handleConfirm = async () => {
    if (!isMatch) return
    await remove(ovaId)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Eliminar este OVA"
      description="Esta acción es permanente. No se puede deshacer."
      size="md"
      dismissOnOverlay={!isLoading}
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-3 text-sm text-rose-800">
          <p className="font-medium">⚠️ Se eliminarán para siempre:</p>
          <ul className="mt-1.5 list-disc pl-5 text-rose-700/90 space-y-0.5">
            <li>El OVA <strong>"{ovaTitle}"</strong></li>
            <li>Las respuestas de las 5 fases ADDIE</li>
            <li>Todos los archivos adjuntos (en Supabase)</li>
            <li>El progreso del estudiante</li>
            <li>Las evaluaciones del docente</li>
          </ul>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm-title" className="text-sm font-medium text-stone-800">
            Para confirmar, escribe el título del OVA:{' '}
            <span className="font-semibold text-rose-700">{ovaTitle}</span>
          </label>
          <input
            id="confirm-title"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={isLoading}
            placeholder={ovaTitle}
            className="h-11 w-full rounded-lg border border-stone-200 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          >
            {error}
          </div>
        ) : null}

        <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
            className="!w-auto sm:!w-32"
          >
            Cancelar
          </Button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading || !isMatch}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white transition-colors duration-150 hover:bg-rose-700 active:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 sm:w-44"
          >
            {isLoading ? (
              <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : null}
            {isLoading ? 'Eliminando…' : 'Eliminar para siempre'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
