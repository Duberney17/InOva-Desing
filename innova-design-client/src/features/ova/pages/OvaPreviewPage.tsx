import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useCurrentUser } from '@/store/auth.store'
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader'
import { PhaseDataReadOnly } from '@/features/instructor-eval/components/PhaseDataReadOnly'
import { EvaluationStatusBadge } from '@/features/instructor-eval/components/EvaluationStatusBadge'
import { instructorEvalService } from '@/features/instructor-eval/services/instructor-eval.service'
import { ovaService, type OvaResponse, type UserProgressResponse } from '../services/ova.service'
import { PHASES } from '../types/ova.types'
import type { PhaseSlug } from '@/features/dashboard/types/dashboard.types'
import type { InstructorEvalResponse } from '@/features/instructor-eval/types/instructor-eval.types'

/**
 * Vista previa del OVA construido (CU-9).
 *
 * Carga en paralelo:
 *  - El OVA (título, descripción, estado)
 *  - Los datos de las 5 fases ADDIE
 *  - Las evaluaciones del docente (todas las fases en una request)
 *  - El progreso del estudiante (porcentaje, fases completadas)
 *
 * Quién la ve:
 *  - El estudiante: para revisar su trabajo antes de finalizar
 *  - El docente: para tener una visión global del OVA
 *
 * Es de solo-lectura, ambos roles ven lo mismo.
 */

interface PhaseSnapshot {
  slug: PhaseSlug
  label: string
  data: Record<string, unknown> | null
  evaluation: InstructorEvalResponse | null
}

export function OvaPreviewPage() {
  const { ovaId } = useParams<{ ovaId: string }>()
  const user = useCurrentUser()

  const [ova, setOva] = useState<OvaResponse | null>(null)
  const [progress, setProgress] = useState<UserProgressResponse | null>(null)
  const [phases, setPhases] = useState<PhaseSnapshot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!ovaId) return
    let cancelled = false

    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset al cambiar de OVA
    setIsLoading(true)

    // Carga: OVA + evaluaciones (1 request c/u) y datos de las 5 fases (5 requests).
    Promise.all([
      ovaService.getOva(ovaId).catch(() => null),
      instructorEvalService.getByOva(ovaId),
      ...PHASES.map((p) =>
        ovaService.getPhaseData(p.slug, ovaId).then((data) => ({ slug: p.slug, data })),
      ),
    ])
      .then(async ([ovaResp, evals, ...phaseResults]) => {
        if (cancelled) return
        if (!ovaResp) {
          setNotFound(true)
          return
        }

        setOva(ovaResp)

        // Mapa de evaluaciones por slug para lookup rápido
        const evalBySlug = new Map<PhaseSlug, InstructorEvalResponse>()
        evals.forEach((e) => evalBySlug.set(e.fase, e))

        // Construimos los snapshots por fase
        const snaps: PhaseSnapshot[] = PHASES.map((p) => {
          const result = phaseResults.find((r) => r.slug === p.slug)
          return {
            slug: p.slug,
            label: p.label,
            data: result?.data ?? null,
            evaluation: evalBySlug.get(p.slug) ?? null,
          }
        })
        setPhases(snaps)

        // Progreso (necesita idEstudiante del OVA)
        const prog = await ovaService
          .getProgress(ovaResp._id, ovaResp.idEstudiante)
          .catch(() => null)
        if (!cancelled) setProgress(prog)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [ovaId])

  if (!ovaId) return <Navigate to="/dashboard" replace />
  if (notFound) return <Navigate to="/dashboard" replace />

  const completedCount = phases.filter((p) => p.data !== null).length
  const approvedCount = phases.filter((p) => p.evaluation?.estado === 'aprobado').length
  const isOwner = user?.id === ova?.idEstudiante
  const resumeSlug = (progress?.faseActual ?? 'analisis') as PhaseSlug

  return (
    <div className="min-h-screen bg-[#f0ede6]">
      <DashboardHeader />

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Breadcrumb / botón volver */}
        <Link
          to="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 transition hover:text-stone-700"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
            <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 010 1.06L8.06 10l3.72 3.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z" clipRule="evenodd" />
          </svg>
          Volver al dashboard
        </Link>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <svg className="size-10 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        ) : ova ? (
          <>
            {/* HEADER del OVA */}
            <header className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-100">
                Vista previa del OVA
              </p>
              <h1 className="mt-1.5 font-serif text-3xl font-semibold leading-tight">
                {ova.title}
              </h1>
              {ova.description ? (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-50/90">
                  {ova.description}
                </p>
              ) : null}

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Progreso" value={`${progress?.porcentaje ?? 0}%`} />
                <Stat label="Fases con datos" value={`${completedCount}/5`} />
                <Stat label="Aprobadas" value={`${approvedCount}/5`} />
                <Stat
                  label="Estado"
                  value={
                    ova.state === 'completado'
                      ? 'Completado'
                      : ova.state === 'revisado'
                      ? 'Revisado'
                      : 'En progreso'
                  }
                />
              </div>
            </header>

            {/* RESUMEN DE FASES */}
            <section className="mt-8 flex flex-col gap-5">
              {phases.map((p, idx) => (
                <PhaseSnapshotCard
                  key={p.slug}
                  index={idx + 1}
                  snapshot={p}
                />
              ))}
            </section>

            {/* ACCIONES */}
            <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:flex-row sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-stone-800">
                  ¿Quieres seguir trabajando en este OVA?
                </p>
                <p className="text-xs text-stone-500">
                  {isOwner
                    ? 'Continúa donde lo dejaste o reinicia desde Análisis.'
                    : 'Como docente, entra a la fase actual del estudiante para evaluar.'}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/dashboard"
                  className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                >
                  Cerrar
                </Link>
                <Link
                  to={`/ova/${ova._id}/fase/${resumeSlug}`}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  {isOwner ? 'Continuar editando' : 'Entrar a evaluar'}
                </Link>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

/** Estadística pequeña usada en el header del OVA. */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/10 px-3 py-2 ring-1 ring-white/15 backdrop-blur">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-100">
        {label}
      </p>
      <p className="mt-0.5 text-base font-semibold">{value}</p>
    </div>
  )
}

/** Card de UNA fase: encabezado con número, label, badge de evaluación + datos + observaciones. */
function PhaseSnapshotCard({
  index,
  snapshot,
}: {
  index: number
  snapshot: PhaseSnapshot
}) {
  const { slug, label, data, evaluation } = snapshot

  return (
    <section>
      <header className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
            {index}
          </div>
          <h2 className="text-lg font-semibold text-stone-800">{label}</h2>
        </div>
        {evaluation ? <EvaluationStatusBadge estado={evaluation.estado} size="sm" /> : null}
      </header>

      <PhaseDataReadOnly data={data} fase={slug} />

      {/* Observación del docente (si la hay y no está vacía) */}
      {evaluation && evaluation.observaciones && evaluation.estado !== 'pendiente' ? (
        <div
          className={`mt-3 rounded-xl border px-4 py-3 text-sm ${
            evaluation.estado === 'aprobado'
              ? 'border-brand-200 bg-brand-50/60 text-brand-900/90'
              : 'border-rose-200 bg-rose-50/60 text-rose-900/90'
          }`}
        >
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest opacity-70">
            Observación del docente
          </p>
          <p className="whitespace-pre-wrap leading-relaxed">{evaluation.observaciones}</p>
        </div>
      ) : null}
    </section>
  )
}
