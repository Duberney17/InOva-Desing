import type { ReactNode } from 'react'
import { BrandPanel } from '@/features/auth/components/BrandPanel'

interface AuthLayoutProps {
  children: ReactNode
}

/** Layout compartido de auth: dos columnas en desktop, solo card en móvil. */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto grid h-full min-h-[calc(100vh-2rem)] max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2 lg:min-h-[calc(100vh-5rem)]">
        <BrandPanel />
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100 sm:p-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
