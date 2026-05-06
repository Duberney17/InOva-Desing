import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import {
  registerSchema,
  type RegisterFormValues,
} from '@/features/auth/schemas/auth.schemas'
import { useRegister } from '@/features/auth/hooks/useRegister'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { RoleChip } from '@/features/auth/components/RoleChip'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

/**
 * Pantalla de Registro (CU-2).
 *
 * Diferencias vs Login:
 *   - Campo `name` adicional.
 *   - Selector de rol funcional (no solo informativo).
 *
 * Para el rol usamos <Controller> de RHF porque no son inputs nativos
 * sino botones (chips). Controller hace de puente con cualquier
 * componente custom.
 */
export function RegisterPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      idDocente: '',
      // Sin valor por defecto: forzamos al usuario a elegir.
      rol: undefined as unknown as RegisterFormValues['rol'],
    },
  })

  // Observamos el rol elegido para mostrar/ocultar el campo "código de docente"
  const rolSelected = useWatch({ control, name: 'rol' })

  const { submit, isLoading, error } = useRegister()

  return (
    <AuthLayout>
      <header className="mb-6">
        <h2 className="font-serif text-3xl font-semibold text-slate-900">
          Crea tu cuenta
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Únete a InOva Design y empieza a diseñar OVAs
        </p>
      </header>

      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <Input
          label="Nombre completo"
          type="text"
          autoComplete="name"
          placeholder="María López"
          error={errors.name?.message}
          {...register('name')}
        />

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
          autoComplete="new-password"
          placeholder="Mínimo 6 caracteres"
          hint="Usa al menos 6 caracteres"
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Selector de rol — funcional con Controller */}
        <Controller
          control={control}
          name="rol"
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-800">
                Te registras como
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <RoleChip
                  role="estudiante"
                  interactive
                  selected={field.value === 'estudiante'}
                  onClick={() => field.onChange('estudiante')}
                />
                <RoleChip
                  role="docente"
                  interactive
                  selected={field.value === 'docente'}
                  onClick={() => field.onChange('docente')}
                />
              </div>
              {errors.rol ? (
                <span className="text-xs text-rose-600">
                  {errors.rol.message}
                </span>
              ) : null}
            </div>
          )}
        />

        {/* Campo opcional para vincular con docente — solo si rol=estudiante */}
        {rolSelected === 'estudiante' ? (
          <Input
            label="Código de tu docente (opcional)"
            type="text"
            placeholder="Pega aquí el código que te dio tu docente"
            hint="Pídeselo a tu docente. Si no lo tienes, puedes dejarlo en blanco."
            error={errors.idDocente?.message}
            {...register('idDocente')}
          />
        ) : null}

        {/* Error global del backend (email ya existe, etc.) */}
        {error ? (
          <div
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          >
            {error}
          </div>
        ) : null}

        <Button type="submit" isLoading={isLoading} className="mt-2">
          {isLoading ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <Link
          to="/login"
          className="font-semibold text-brand-700 hover:text-brand-800 hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  )
}
