import { Link, useNavigate } from 'react-router-dom'
import { useCurrentUser, useAuthStore } from '@/store/auth.store'

/**
 * Header común a todas las pantallas autenticadas.
 *
 * Tiene tres zonas:
 *   - Logo (link al dashboard, "ir a inicio")
 *   - Identidad (nombre + rol)
 *   - Botón explícito "Salir" (no escondido en el avatar)
 */
export function DashboardHeader() {
  const user = useCurrentUser()
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const initials =
    user?.name
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
        {/* LOGO — clickeable, lleva al dashboard */}
        <Link
          to="/dashboard"
          aria-label="Ir al inicio"
          className="flex items-center gap-2 rounded-md px-1 py-1 transition hover:bg-stone-50"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-700 text-sm font-bold text-white">
            I
          </span>
          <span className="text-base font-semibold text-stone-800">InOva Design</span>
        </Link>

        {/* IDENTIDAD + SALIR */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium leading-tight text-stone-800">
              {user?.name}
            </p>
            <p className="text-xs leading-tight text-stone-500">{roleLabel}</p>
          </div>

          {/* Avatar — solo decorativo, NO es el botón de logout */}
          <div
            aria-hidden
            className="flex size-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white"
          >
            {initials}
          </div>

          {/* Botón explícito de salir */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
              <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clipRule="evenodd" />
            </svg>
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
