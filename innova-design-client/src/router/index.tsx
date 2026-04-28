import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ProtectedRoute } from '@/router/ProtectedRoute'
import { PublicOnlyRoute } from '@/router/PublicOnlyRoute'
import { DashboardPlaceholder } from '@/router/DashboardPlaceholder'

/**
 * Definición central de rutas.
 *
 * Estructura:
 *   /                  → redirect a /dashboard
 *   /login, /register  → solo para no-autenticados (PublicOnlyRoute)
 *   /dashboard         → solo para autenticados (ProtectedRoute)
 *   *                  → 404 simple (redirect a /dashboard por ahora)
 *
 * Cuando agreguemos más features (OVAs, ADDIE, etc.) las metemos como
 * hijos del bloque `ProtectedRoute`.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard', element: <DashboardPlaceholder /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])
