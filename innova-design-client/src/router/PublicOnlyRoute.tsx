import { Navigate, Outlet } from 'react-router-dom'
import { useIsAuthenticated } from '@/store/auth.store'

/** Opuesto de ProtectedRoute: si ya hay sesión, redirige a /dashboard. */
export function PublicOnlyRoute() {
  const isAuth = useIsAuthenticated()
  if (isAuth) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
