import { useEffect, useState } from 'react'
import { useCurrentUser } from '@/store/auth.store'
import {
  usersService,
  type UserResponse,
} from '@/features/users/services/users.service'
import { ovaService } from '@/features/ova/services/ova.service'
import { DashboardHeader } from '../components/DashboardHeader'
import { TeacherCodeCard } from '../components/TeacherCodeCard'
import { StudentRow, type StudentOvaSummary } from '../components/StudentRow'

/**
 * Dashboard del docente (CU-5 base).
 *
 * Estrategia de carga:
 *  1. GET /users/students/:idDocente  → estudiantes del docente
 *  2. Por cada estudiante, GET /ovas/student/:id + GET progreso (paralelo)
 *  3. Construimos un mapa { studentId → OvaSummary[] }
 *
 * Para una primera versión es N+1 requests, suficiente. Si crece se
 * puede optimizar con un endpoint agregado en el backend.
 */
export function TeacherDashboardPage() {
  const user = useCurrentUser()
  const firstName = user?.name.split(' ')[0] ?? 'docente'

  const [students, setStudents] = useState<UserResponse[]>([])
  const [ovasByStudent, setOvasByStudent] = useState<Record<string, StudentOvaSummary[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return
    const teacherId = user.id
    let cancelled = false

    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset al cambiar de docente
    setIsLoading(true)
    setError(null)

    usersService
      .getStudentsByTeacher(teacherId)
      .then(async (sts) => {
        if (cancelled) return
        setStudents(sts)

        // Cargar OVAs y progreso de cada estudiante en paralelo
        const entries = await Promise.all(
          sts.map(async (s) => {
            try {
              const raws = await ovaService.getStudentOvas(s._id)
              const summaries: StudentOvaSummary[] = await Promise.all(
                raws.map(async (raw) => {
                  const progress = await ovaService.getProgress(raw._id, s._id)
                  return {
                    id: raw._id,
                    title: raw.title,
                    progress: progress?.porcentaje ?? 0,
                    faseActual: progress?.faseActual ?? 'analisis',
                    status: (raw.state as StudentOvaSummary['status']) ?? 'en_progreso',
                  }
                }),
              )
              return [s._id, summaries] as const
            } catch {
              return [s._id, []] as const
            }
          }),
        )

        if (!cancelled) {
          setOvasByStudent(Object.fromEntries(entries))
        }
      })
      .catch(() => {
        if (!cancelled) setError('No se pudo cargar la lista de estudiantes')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user?.id])

  // Métricas derivadas
  const totalStudents = students.length
  const totalOvas = Object.values(ovasByStudent).reduce((acc, arr) => acc + arr.length, 0)
  const totalCompleted = Object.values(ovasByStudent)
    .flat()
    .filter((o) => o.status === 'completado' || o.status === 'revisado').length

  return (
    <div className="min-h-screen bg-[#f0ede6]">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-800">
            Hola, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Revisa el progreso de tus estudiantes y entra a sus OVAs cuando lo necesites.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          {/* COLUMNA IZQUIERDA: código + métricas */}
          <aside className="flex flex-col gap-4">
            {user?.id && <TeacherCodeCard code={user.id} />}

            <div className="grid grid-cols-3 gap-2">
              <Stat label="Estudiantes" value={totalStudents} />
              <Stat label="OVAs" value={totalOvas} />
              <Stat label="Finalizados" value={totalCompleted} />
            </div>
          </aside>

          {/* COLUMNA DERECHA: lista de estudiantes */}
          <section>
            <header className="mb-3 flex items-baseline justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                Mis estudiantes
              </h2>
              {!isLoading && students.length > 0 && (
                <span className="text-xs text-stone-400">
                  {students.length} en total
                </span>
              )}
            </header>

            {isLoading ? (
              <div className="flex items-center justify-center rounded-2xl bg-white py-20 ring-1 ring-stone-200">
                <svg className="size-8 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </div>
            ) : error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            ) : students.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="flex flex-col gap-2">
                {students.map((s) => (
                  <StudentRow
                    key={s._id}
                    student={s}
                    ovas={ovasByStudent[s._id] ?? []}
                    isLoadingOvas={!ovasByStudent[s._id]}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white p-3 text-center shadow-sm ring-1 ring-stone-200">
      <p className="text-xl font-bold text-stone-800">{value}</p>
      <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-500">
        {label}
      </p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center ring-1 ring-stone-200">
      <div className="flex size-14 items-center justify-center rounded-full bg-brand-50">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-7 text-brand-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-semibold text-stone-800">
        Aún no tienes estudiantes vinculados
      </h3>
      <p className="mt-1.5 max-w-sm px-6 text-sm text-stone-500">
        Comparte tu <strong>código de docente</strong> (panel izquierdo) con tus
        estudiantes. Cuando se registren con él aparecerán aquí.
      </p>
    </div>
  )
}
