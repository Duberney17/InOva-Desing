import { useState, useEffect } from 'react'
import { useCurrentUser } from '@/store/auth.store'
import { ovaService, type OvaResponse } from '@/features/ova/services/ova.service'
import { CreateOvaModal } from '@/features/ova/components/CreateOvaModal'
import { instructorEvalService } from '@/features/instructor-eval/services/instructor-eval.service'
import { DashboardHeader } from '../components/DashboardHeader'
import { OvaActiveCard } from '../components/OvaActiveCard'
import { OvaListItem } from '../components/OvaListItem'
import { OvaSummaryPanel } from '../components/OvaSummaryPanel'
import { RecentActivityPanel } from '../components/RecentActivityPanel'
import type { Ova, ActivityItem, EvaluationStatus } from '../types/dashboard.types'
import type { PhaseSlug } from '../types/dashboard.types'

const PHASE_ORDER: PhaseSlug[] = ['analisis', 'diseno', 'desarrollo', 'implementacion', 'evaluacion']
const PHASE_LABEL: Record<PhaseSlug, string> = {
  analisis: 'Análisis', diseno: 'Diseño', desarrollo: 'Desarrollo',
  implementacion: 'Implementación', evaluacion: 'Evaluación',
}

function buildOva(
  raw: OvaResponse,
  completadas: PhaseSlug[],
  faseActual: PhaseSlug,
  porcentaje: number,
  teacherEvaluation: EvaluationStatus,
): Ova {
  return {
    id: raw._id,
    title: raw.title,
    createdAt: new Date(raw.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }),
    status: raw.state === 'completado' ? 'completado' : raw.state === 'revisado' ? 'revisado' : 'en_progreso',
    progress: porcentaje,
    completedPhases: completadas.length,
    totalPhases: 5,
    teacherEvaluation,
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

/** Feed de actividad reciente derivado del OVA activo. */
function buildActivity(ova: Ova | null): ActivityItem[] {
  const items: ActivityItem[] = [
    { id: 'login', description: 'Iniciaste sesión en InOva Design', time: 'Ahora', type: 'success' },
  ]
  if (!ova) return items

  if (ova.status === 'revisado') {
    items.push({
      id: 'finalizado',
      description: `Tu OVA "${ova.title}" fue finalizado por el docente`,
      time: 'Hoy',
      type: 'success',
    })
  } else if (ova.teacherEvaluation === 'rechazado') {
    items.push({
      id: 'ajustes',
      description: 'El docente pidió ajustes en alguna fase',
      time: 'Hoy',
      type: 'warning',
    })
  } else if (ova.progress === 100) {
    items.push({
      id: 'completo',
      description: 'Completaste las 5 fases — esperando evaluación del docente',
      time: 'Hoy',
      type: 'warning',
    })
  } else {
    items.push({
      id: 'enprogreso',
      description: `Tu OVA está en progreso (${ova.progress}%)`,
      time: 'Hoy',
      type: 'neutral',
    })
  }
  return items
}

/**
 * Dashboard del estudiante. Carga sus OVAs y, en paralelo, el progreso y
 * las evaluaciones de cada uno. El OVA "activo" del panel es el que el
 * usuario seleccionó (o, por defecto, el primero en progreso).
 */
export function StudentDashboardPage() {
  const user = useCurrentUser()
  const firstName = user?.name.split(' ')[0] ?? 'estudiante'

  const [ovas, setOvas] = useState<Ova[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedOvaId, setSelectedOvaId] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return
    const userId = user.id
    let cancelled = false

    ovaService
      .getStudentOvas(userId)
      .then(async (raws) => {
        const enriched = await Promise.all(
          raws.map(async (raw) => {
            const [progress, evals] = await Promise.all([
              ovaService.getProgress(raw._id, userId),
              instructorEvalService.getByOva(raw._id),
            ])
            const completadas = (progress?.fasesCompletadas ?? []) as PhaseSlug[]
            const faseActual = (progress?.faseActual ?? 'analisis') as PhaseSlug
            const porcentaje = progress?.porcentaje ?? 0

            // Estado agregado: aprobado si todas las 5 fases lo están,
            // rechazado si alguna está rechazada, pendiente en otro caso.
            const aprobadas = evals.filter((e) => e.estado === 'aprobado').length
            const rechazadas = evals.filter((e) => e.estado === 'rechazado').length
            const teacherEvaluation: EvaluationStatus =
              aprobadas >= 5 ? 'aprobado' : rechazadas > 0 ? 'rechazado' : 'pendiente'

            return buildOva(raw, completadas, faseActual, porcentaje, teacherEvaluation)
          }),
        )
        if (!cancelled) setOvas(enriched)
      })
      .catch(() => {
        if (!cancelled) setOvas([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user?.id, refreshKey])

  // Después de eliminar un OVA o cerrar el modal de crear, refrescamos
  const handleRefresh = () => setRefreshKey((k) => k + 1)

  // El OVA activo:
  //  1. Si el usuario eligió uno explícito y aún existe → ese
  //  2. Si no, autoselección: primero en progreso, o el primero a secas
  const selectedExplicit = selectedOvaId ? ovas.find((o) => o.id === selectedOvaId) : null
  const activeOva =
    selectedExplicit ?? ovas.find((o) => o.status === 'en_progreso') ?? ovas[0] ?? null
  const otherOvas = ovas.filter((o) => o.id !== activeOva?.id)

  return (
    <div className="min-h-screen bg-[#f0ede6]">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">
              Hola, {firstName} 👋
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              {activeOva
                ? `Tienes ${ovas.length} OVA${ovas.length === 1 ? '' : 's'} en construcción.`
                : 'Crea tu primer OVA para comenzar.'}
            </p>
          </div>

          {ovas.length > 0 && (
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="shrink-0 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              + Nuevo OVA
            </button>
          )}
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
            <div className="flex flex-col gap-6">
              <OvaActiveCard ova={activeOva} onDeleted={handleRefresh} />

              {otherOvas.length > 0 && (
                <section>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
                    Tus otros OVAs ({otherOvas.length})
                  </h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {otherOvas.map((o) => (
                      <OvaListItem
                        key={o.id}
                        ova={o}
                        onSelect={() => setSelectedOvaId(o.id)}
                        onDeleted={handleRefresh}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <OvaSummaryPanel ova={activeOva} />
              <RecentActivityPanel items={buildActivity(activeOva)} />
            </div>
          </div>
        ) : (
          <EmptyState onNew={() => setIsCreateOpen(true)} />
        )}
      </main>

      <CreateOvaModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
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
