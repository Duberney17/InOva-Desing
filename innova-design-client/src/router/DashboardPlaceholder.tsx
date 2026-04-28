import { useCurrentUser, useAuthStore } from '@/store/auth.store'
import { useNavigate } from 'react-router-dom'

/**
 * Placeholder temporal del dashboard.
 *
 * Solo existe para tener una pantalla "dentro" donde redirigir tras el
 * login y demostrar que la sesión funciona. En el siguiente CU lo
 * reemplazaremos por el dashboard real (con la lista de OVAs, etc.).
 */
export function DashboardPlaceholder() {
  const user = useCurrentUser()
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold text-slate-800">
          Bienvenido, {user?.name} 👋
        </h1>
        <p className="mt-2 text-slate-600">
          Sesión activa como{' '}
          <span className="font-medium text-brand-700">{user?.rol}</span>{' '}
          ({user?.email}).
        </p>
        <p className="mt-4 text-sm text-slate-500">
          {/* Aquí construiremos el dashboard de OVAs en el siguiente caso de uso. */}
        </p>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
