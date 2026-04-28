import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import {
  loginSchema,
  type LoginFormValues,
} from '@/features/auth/schemas/auth.schemas'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { RoleChip } from '@/features/auth/components/RoleChip'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

/**
 * Pantalla de Login (CU-1).
 *
 * Estructura:
 *   - useForm con Zod resolver para validación.
 *   - useLogin para manejar la llamada + redirección.
 *   - El form solo se preocupa por: campos, submit, mostrar errores.
 */
export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const { submit, isLoading, error } = useLogin()

  return (
    <AuthLayout>
      <header className="mb-7">
        <h2 className="font-serif text-3xl font-semibold text-slate-900">
          Bienvenido de nuevo
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Ingresa a tu cuenta para continuar con tu OVA
        </p>
      </header>

      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <Input
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Error global del backend (credenciales incorrectas, etc.) */}
        {error ? (
          <div
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          >
            {error}
          </div>
        ) : null}

        <Button type="submit" isLoading={isLoading} className="mt-2">
          {isLoading ? 'Ingresando…' : 'Iniciar sesión'}
        </Button>
      </form>

      {/* Separador "o" */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">o</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Chips de rol — solo informativos */}
      <div className="flex items-center justify-center gap-2">
        <RoleChip role="estudiante" />
        <RoleChip role="docente" />
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        ¿No tienes cuenta?{' '}
        <Link
          to="/register"
          className="font-semibold text-brand-700 hover:text-brand-800 hover:underline"
        >
          Regístrate aquí
        </Link>
      </p>
    </AuthLayout>
  )
}
