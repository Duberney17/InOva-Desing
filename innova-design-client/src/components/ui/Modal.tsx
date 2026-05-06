import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

interface ModalProps {
  /** Si está abierto */
  open: boolean
  /** Callback al cerrar (overlay click, Escape, botón X) */
  onClose: () => void
  /** Título del modal (sale en el header). Opcional */
  title?: string
  /** Descripción corta debajo del título. Opcional */
  description?: string
  /** Contenido (form, texto, etc.) */
  children: ReactNode
  /** Tamaño máximo. 'md' (default) ≈ 28rem, 'lg' ≈ 36rem */
  size?: 'sm' | 'md' | 'lg'
  /** Si false, no se cierra al hacer click fuera (útil para forms con cambios) */
  dismissOnOverlay?: boolean
}

/**
 * Modal base de la app.
 *
 * Implementación: usamos un <div> overlay + <div> dialog en flujo normal,
 * NO position:fixed (Cowork bloquea iframes con position:fixed). Para una app
 * real con `<dialog>` nativo o un portal sería mejor, pero esta versión
 * funciona en todos lados sin dependencias.
 *
 * Accesibilidad:
 *  - role="dialog", aria-modal="true"
 *  - cierre con Escape
 *  - foco inicial en el primer elemento interactivo
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  dismissOnOverlay = true,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Cierre con Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Bloquear scroll del body mientras está abierto
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Foco inicial
  useEffect(() => {
    if (!open) return
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
      'input, textarea, button, select, [tabindex]:not([tabindex="-1"])',
    )
    firstFocusable?.focus()
  }, [open])

  if (!open) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
  }[size]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm"
      onClick={() => {
        if (dismissOnOverlay) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-desc' : undefined}
        className={`w-full ${sizeClasses} rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 sm:p-7`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <header className="mb-5">
            {title && (
              <h2
                id="modal-title"
                className="font-serif text-xl font-semibold text-slate-900"
              >
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-desc" className="mt-1.5 text-sm text-slate-500">
                {description}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </div>
  )
}
