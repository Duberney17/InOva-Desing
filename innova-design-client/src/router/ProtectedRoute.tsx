import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useIsAuthenticated } from '@/store/auth.store'

/**
 * Ruta protegida: si no hay sesión, redirige a /login guardando la URL
 * original en state.from para devolver al usuario después del login.
 */
export function ProtectedRoute() {
  const isAuth = useIsAuthenticated()
  const location = useLocation()

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
