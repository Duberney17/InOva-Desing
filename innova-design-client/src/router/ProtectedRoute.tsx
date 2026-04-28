import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useIsAuthenticated } from '@/store/auth.store'

/**
 * Ruta protegida.
 *
 * Si el usuario NO tiene sesión, lo manda a /login y guarda en `state.from`
 * la URL que intentaba visitar — así, después del login podemos devolverlo
 * al sitio original (UX detalle pequeño pero muy apreciado).
 */
export function ProtectedRoute() {
  const isAuth = useIsAuthenticated()
  const location = useLocation()

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
