import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '@/store/auth.store'
import { ovaService, type OvaResponse } from '@/features/ova/services/ova.service'
import { DashboardHeader } from '../components/DashboardHeader'
import { OvaActiveCard } from '../components/OvaActiveCard'
import { OvaSummaryPanel } from '../components/OvaSummaryPanel'
import { RecentActivityPanel } from '../components/RecentActivityPanel'
import type { Ova, ActivityItem } from '../types/dashboard.types'
import type { PhaseSlug } from '../types/dashboard.types'

const PHASE_ORDER: PhaseSlug[] = ['analisis', 'diseno', 'desarrollo', 'implementacion', 'evaluacion']
const PHASE_LABEL: Record<PhaseSlug, string> = {
  analisis: 'Análisis', diseno: 'Diseño', desarrollo: 'Desarrollo',
  implementacion: 'Implementación', evaluacion: 'Evaluación',
}

function buildOva(raw: OvaResponse, completadas: PhaseSlug[], faseActual: PhaseSlug, porcentaje: number): Ova {
  return {
    id: raw._id,
    title: raw.title,
    createdAt: new Date(raw.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }),
    status: raw.state === 'completado' ? 'completado' : 'en_progreso',
    progress: porcentaje,
    completedPhases: completadas.length,
    totalPhases: 5,
    teacherEvaluation: 'pendiente',
    lastActivity: 'Hoy',
    phases: PHASE_ORDER.map((slug) => ({
      slug,
      label: PHASE_LABEL[slug],
      status: completadas.includes(slug)
        ? 'completed'
        : slug === faseActual
        ? 'in_progress'
        : 'pending',
    })),
  }
}

const STATIC_ACTIVITY: ActivityItem[] = [
  { id: '1', description: 'Iniciaste sesión en InOva Design', time: 'Ahora',  type: 'success' },
  { id: '2', description: 'Tu OVA está en progreso',          time: 'Hoy',    type: 'warning' },
]

export function StudentDashboardPage() {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const firstName = user?.name.split(' ')[0] ?? 'estudiante'

  const [activeOva, setActiveOva] = useState<Ova | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    ovaService.getStudentOvas(user.id).then(async (ovas) => {
      const inProgress = ovas.find((o) => o.state === 'en_progreso') ?? ovas[0]
      if (!inProgress) { setIsLoading(false); return }

      const progress = await ovaService.getProgress(inProgress._id, user.id!)
      const completadas = (progress?.fasesCompletadas ?? []) as PhaseSlug[]
      const faseActual = (progress?.faseActual ?? 'analisis') as PhaseSlug
      const porcentaje = progress?.porcentaje ?? 0

      setActiveOva(buildOva(inProgress, completadas, faseActual, porcentaje))
    }).catch(() => {
      setActiveOva(null)
    }).finally(() => setIsLoading(false))
  }, [user?.id])

  return (
    <div className="min-h-screen bg-[#f0ede6]">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-800">
            Hola, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {activeOva
              ? 'Continúa trabajando en tu OVA — vas por buen camino.'
              : 'Crea tu primer OVA para comenzar.'}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <svg className="size-10 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        ) : activeOva ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <OvaActiveCard ova={activeOva} />

            <div className="flex flex-col gap-4">
              <OvaSummaryPanel ova={activeOva} />
              <RecentActivityPanel items={STATIC_ACTIVITY} />

              <button
                type="button"
                onClick={() => navigate('/ova/nuevo')}
                className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                + Nuevo OVA
              </button>
            </div>
          </div>
        ) : (
          <EmptyState onNew={() => navigate('/ova/nuevo')} />
        )}
      </main>
    </div>
  )
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 shadow-sm ring-1 ring-stone-200">
      <div className="flex size-16 items-center justify-center rounded-full bg-brand-50">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-8 text-brand-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
      <h2 className="mt-4 text-lg font-semibold text-stone-800">Aún no tienes OVAs</h2>
      <p className="mt-1 text-sm text-stone-500">Crea tu primer Objeto Virtual de Aprendizaje.</p>
      <button
        type="button"
        onClick={onNew}
        className="mt-6 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
      >
        + Nuevo OVA
      </button>
    </div>
  )
}
