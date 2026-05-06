import { useState } from 'react'

interface TeacherCodeCardProps {
  code: string
}

/**
 * Card que muestra el "código" del docente (su _id de Mongo) con un botón
 * para copiar al portapapeles. El docente lo comparte con sus estudiantes
 * para que lo peguen en el formulario de registro.
 */
export function TeacherCodeCard({ code }: TeacherCodeCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback silencioso: si clipboard no funciona, el usuario puede
      // seleccionar manualmente.
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-widest text-brand-100">
            Tu código de docente
          </p>
          <p className="mt-1 text-xs text-brand-100/80">
            Compártelo con tus estudiantes para que se vinculen contigo al
            registrarse.
          </p>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30">
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 ring-1 ring-white/20">
        <code className="flex-1 truncate font-mono text-sm">{code}</code>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-50"
        >
          {copied ? '¡Copiado!' : 'Copiar'}
        </button>
      </div>
    </div>
  )
}
