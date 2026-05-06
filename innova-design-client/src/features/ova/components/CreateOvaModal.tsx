import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useCreateOva } from '@/features/ova/hooks/useCreateOva'
import {
  createOvaSchema,
  type CreateOvaFormValues,
} from '@/features/ova/schemas/ova.schemas'

interface CreateOvaModalProps {
  open: boolean
  onClose: () => void
}

/**
 * Modal para crear un nuevo OVA.
 *
 * Flujo:
 *   1. Usuario abre el modal desde el dashboard.
 *   2. Llena título y (opcional) descripción.
 *   3. Submit → useCreateOva llama al backend.
 *   4. En éxito: cierra el modal + navega a /ova/:id/fase/analisis.
 *   5. En error: muestra mensaje del backend.
 */
export function CreateOvaModal({ open, onClose }: CreateOvaModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateOvaFormValues>({
    resolver: zodResolver(createOvaSchema),
    mode: 'onBlur',
    defaultValues: { title: '', description: '' },
  })

  const { submit, isLoading, error } = useCreateOva(() => {
    reset()
    onClose()
  })

  // Cerrar y limpiar form en un solo lugar
  const handleClose = () => {
    if (isLoading) return // no cerrar mientras guarda
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Crear nuevo OVA"
      description="Empieza por darle un nombre. Podrás editarlo después."
      dismissOnOverlay={!isLoading}
    >
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Título del OVA"
          placeholder="Ej: Pensamiento Computacional en Primaria"
          autoComplete="off"
          autoFocus
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="ova-desc"
            className="text-sm font-medium text-slate-800"
          >
            Descripción <span className="text-slate-400">(opcional)</span>
          </label>
          <textarea
            id="ova-desc"
            rows={3}
            placeholder="Una línea sobre el contenido o intención del OVA"
            className={`w-full resize-none rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-2 ${
              errors.description
                ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:border-brand-500 focus:ring-brand-200'
            }`}
            {...register('description')}
          />
          {errors.description ? (
            <span className="text-xs text-rose-600">
              {errors.description.message}
            </span>
          ) : null}
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          >
            {error}
          </div>
        ) : null}

        <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
            className="!w-auto sm:!w-32"
          >
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading} className="!w-auto sm:!w-44">
            {isLoading ? 'Creando…' : 'Crear y empezar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
