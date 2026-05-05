interface PhaseFormShellProps {
  onSubmit: (e: React.FormEvent) => void
  isSaving?: boolean
  children: React.ReactNode
}

export function PhaseFormShell({ onSubmit, isSaving, children }: PhaseFormShellProps) {
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {children}

      <div className="flex items-center justify-between gap-4 border-t border-stone-100 pt-4">
        <p className="text-xs text-stone-400">
          Los cambios se guardan al hacer clic en "Guardar avance".
        </p>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {isSaving && (
            <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          )}
          Guardar avance
        </button>
      </div>
    </form>
  )
}
