import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { OvaPhasePage } from '@/features/ova/pages/OvaPhasePage'
import { OvaPreviewPage } from '@/features/ova/pages/OvaPreviewPage'
import { ProtectedRoute } from '@/router/ProtectedRoute'
import { PublicOnlyRoute } from '@/router/PublicOnlyRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/login',    element: <LoginPage />    },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard',                         element: <DashboardPage />  },
      { path: '/ova/:ovaId/fase/:phaseSlug',        element: <OvaPhasePage />   },
      { path: '/ova/:ovaId/preview',                element: <OvaPreviewPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])
