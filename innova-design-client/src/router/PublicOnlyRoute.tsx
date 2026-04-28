import { Navigate, Outlet } from 'react-router-dom'
import { useIsAuthenticated } from '@/store/auth.store'

/**
 * El opuesto de ProtectedRoute: rutas SOLO para usuarios sin sesión
 * (login, registro). Si ya estás logueado y entras a /login, te
 * mandamos a /dashboard en vez de mostrar el formulario.
 */
export function PublicOnlyRoute() {
  const isAuth = useIsAuthenticated()
  if (isAuth) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
