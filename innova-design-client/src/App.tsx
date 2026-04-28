import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'

/**
 * Componente raíz de la aplicación.
 *
 * Su única responsabilidad es montar el RouterProvider con la
 * configuración de rutas. Cualquier provider global (Theme, Toaster,
 * QueryClient, etc.) iría envolviendo aquí en el futuro.
 */
function App() {
  return <RouterProvider router={router} />
}

export default App
