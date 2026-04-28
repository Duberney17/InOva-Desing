import type { UserRole } from '@/types/user'

interface RoleChipProps {
  role: UserRole
  /** Si es interactivo (en el formulario de registro) */
  interactive?: boolean
  selected?: boolean
  onClick?: () => void
}

/**
 * Chip visual para indicar/seleccionar un rol.
 *
 * En LoginPage es solo decorativo (interactive=false): muestra a quién
 * va dirigida la plataforma.
 *
 * En RegisterPage es clickeable: el usuario elige su rol antes de
 * registrarse.
 */
export function RoleChip({ role, interactive, selected, onClick }: RoleChipProps) {
  const isDocente = role === 'docente'
  const label = isDocente ? '🎓 Docente' : '👤 Estudiante'

  // Colores por rol — un toque visual distinto para cada uno.
  const colorClasses = isDocente
    ? selected
      ? 'bg-amber-100 text-amber-800 ring-amber-300'
      : 'bg-amber-50 text-amber-700 ring-amber-200'
    : selected
      ? 'bg-brand-100 text-brand-800 ring-brand-300'
      : 'bg-brand-50 text-brand-700 ring-brand-200'

  const interactiveClasses = interactive
    ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform'
    : ''

  const ringWeight = selected ? 'ring-2' : 'ring-1'

  const className = `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${ringWeight} ${colorClasses} ${interactiveClasses}`

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        className={className}
      >
        {label}
      </button>
    )
  }

  return <span className={className}>{label}</span>
}
