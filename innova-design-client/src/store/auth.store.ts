import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/types/user'

/**
 * Store global de autenticación.
 *
 * Estado:
 *   - user:        datos del usuario logueado (o null).
 *   - accessToken: JWT firmado por el backend (o null).
 *
 * Acciones:
 *   - setSession(user, token): se llama al login/register exitoso.
 *   - logout():               limpia todo.
 *
 * Selectores derivados (computed-style):
 *   - useIsAuthenticated()
 *   - useCurrentUser()
 *
 * NOTA sobre el persist: la clave 'inova-auth' DEBE coincidir con la que
 * lee `lib/axios.ts` para inyectar el token. Si la cambias acá, cámbiala allá.
 */
interface AuthState {
  user: User | null
  accessToken: string | null
  setSession: (user: User, accessToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setSession: (user, accessToken) => set({ user, accessToken }),
      logout: () => set({ user: null, accessToken: null }),
    }),
    {
      name: 'inova-auth', // 👈 clave en localStorage
      storage: createJSONStorage(() => localStorage),
      // Solo persistimos lo necesario; nunca persistas funciones u objetos pesados.
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    },
  ),
)

// ─── Selectores ──────────────────────────────────────────────────────────
// Patrón recomendado: en vez de hacer `useAuthStore((s) => s.user)` regado
// por toda la app, exponemos hooks pequeños y nombrados. Más legible y
// más fácil de refactorizar.

export const useCurrentUser = () => useAuthStore((s) => s.user)
export const useIsAuthenticated = () => useAuthStore((s) => s.accessToken !== null)
