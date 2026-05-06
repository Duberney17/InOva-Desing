import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useResetOva } from '@/features/ova/hooks/useResetOva'

interface ResetOvaModalProps {
  open: boolean
  onClose: () => void
  ovaId: string
}

/**
 * Modal de confirmación para reiniciar el progreso de un OVA.
 *
 * UX importante:
 *  - El botón confirmar es ámbar (atención, no rojo, porque NO se borran los
 *    datos de cada fase, solo el progreso).
 *  - Mientras está cargando, el modal no se cierra al hacer click fuera.
 *  - Si hay error, lo muestra inline.
 */
export function ResetOvaModal({ open, onClose, ovaId }: ResetOvaModalProps) {
  const { reset, isLoading, error } = useResetOva(ovaId)

  const handleConfirm = async () => {
    await reset()
    if (!error) onClose()
  }

  return (
    <Modal
      open={open}
      onClose={isLoading ? () => null : onClose}
      title="Reiniciar este OVA"
      description="Se borrará el progreso de las fases (cuáles están completadas) y volverás al inicio. Las respuestas guardadas en cada fase NO se eliminan."
      size="md"
      dismissOnOverlay={!isLoading}
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
          <p className="font-medium">¿Estás seguro?</p>
          <p className="mt-1 text-amber-700/90">
            Volverás a la fase de Análisis y el indicador de progreso se reiniciará a 0%.
          </p>
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
            onClick={onClose}
            disabled={isLoading}
            className="!w-auto sm:!w-32"
          >
            Cancelar
          </Button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 text-sm font-semibold text-white transition-colors duration-150 hover:bg-amber-700 active:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 sm:w-44"
          >
            {isLoading ? (
              <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : null}
            {isLoading ? 'Reiniciando…' : 'Sí, reiniciar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
