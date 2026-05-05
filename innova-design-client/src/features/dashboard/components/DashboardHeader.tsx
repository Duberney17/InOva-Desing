import { useNavigate } from 'react-router-dom'
import { useCurrentUser, useAuthStore } from '@/store/auth.store'

export function DashboardHeader() {
  const user = useCurrentUser()
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const initials = user?.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() ?? 'U'

  const roleLabel = user?.rol === 'docente' ? 'Docente' : 'Estudiante'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-700 text-sm font-bold text-white">
            I
          </span>
          <span className="text-base font-semibold text-stone-800">InOva Design</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-stone-800 leading-tight">{user?.name}</p>
            <p className="text-xs text-stone-500 leading-tight">{roleLabel}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Cerrar sesión"
            className="flex size-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            {initials}
          </button>
        </div>
      </div>
    </header>
  )
}
