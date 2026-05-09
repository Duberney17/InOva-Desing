import { useState, useEffect } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { useCurrentUser } from '@/store/auth.store'
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader'
import { PhaseNav } from '../components/PhaseNav'
import { ResetOvaModal } from '../components/ResetOvaModal'
import { PHASES, PHASE_INDEX } from '../types/ova.types'
import type { PhaseSlug } from '@/features/dashboard/types/dashboard.types'
import { AnalysisForm } from '../forms/AnalysisForm'
import { DesignForm } from '../forms/DesignForm'
import { DevelopmentForm } from '../forms/DevelopmentForm'
import { ImplementationForm } from '../forms/ImplementationForm'
import { EvaluationForm } from '../forms/EvaluationForm'
import { ovaService, type OvaResponse } from '../services/ova.service'
// CU-5: vistas dependientes del rol
import { PhaseDataReadOnly } from '@/features/instructor-eval/components/PhaseDataReadOnly'
import { InstructorEvalPanel } from '@/features/instructor-eval/components/InstructorEvalPanel'
import { EvaluationFeedback } from '@/features/instructor-eval/components/EvaluationFeedback'
// Adjuntos por fase
import { PhaseFiles } from '@/features/ova-files/components/PhaseFiles'

export function OvaPhasePage() {
  const { ovaId, phaseSlug } = useParams<{ ovaId: string; phaseSlug: string }>()
  const user = useCurrentUser()
  const isTeacher = user?.rol === 'docente'

  const [isSaving, setIsSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')
  const [savedData, setSavedData] = useState<Record<string, unknown> | null>(null)
  const [phaseDocId, setPhaseDocId] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [isResetOpen, setIsResetOpen] = useState(false)
  // OVA padre — necesitamos su idEstudiante para que el docente pueda crear evaluaciones
  const [ova, setOva] = useState<OvaResponse | null>(null)

  const phaseConfig = PHASES.find((p) => p.slug === phaseSlug)

  // Cargar OVA padre (una vez por ovaId)
  useEffect(() => {
    if (!ovaId) return
    let cancelled = false
    ovaService
      .getOva(ovaId)
      .then((o) => {
        if (!cancelled) setOva(o)
      })
      .catch(() => {
        if (!cancelled) setOva(null)
      })
    return () => {
      cancelled = true
    }
  }, [ovaId])

  // Cargar datos de la fase (cada vez que cambia ovaId o phaseSlug)
  useEffect(() => {
    if (!ovaId || !phaseSlug || !phaseConfig) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset al cambiar de fase
    setIsLoading(true)
    ovaService
      .getPhaseData(phaseSlug as PhaseSlug, ovaId)
      .then((data) => {
        if (cancelled) return
        if (data) {
          setPhaseDocId(data._id as string)
          setSavedData(data)
        } else {
          setPhaseDocId(undefined)
          setSavedData(null)
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
    // phaseConfig se deriva de phaseSlug; añadirlo causaría re-fetch innecesario.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ovaId, phaseSlug])

  if (!ovaId || !phaseSlug || !phaseConfig) {
    return <Navigate to="/dashboard" replace />
  }

  const currentSlug = phaseSlug as PhaseSlug
  const phaseIdx = PHASE_INDEX[currentSlug]
  const prevPhase = phaseIdx > 0 ? PHASES[phaseIdx - 1] : null
  const nextPhase = phaseIdx < PHASES.length - 1 ? PHASES[phaseIdx + 1] : null

  const handleSave = async (data: unknown) => {
    setIsSaving(true)
    setSavedMessage('')
    try {
      const result = await ovaService.savePhaseData(
        currentSlug,
        ovaId,
        data as Parameters<typeof ovaService.savePhaseData>[2],
        phaseDocId,
      )
      setPhaseDocId(result._id as string)
      setSavedData(result)

      if (user?.id) {
        await ovaService.completarFase(ovaId, user.id, currentSlug).catch(() => null)
      }

      setSavedMessage('¡Avance guardado correctamente!')
      setTimeout(() => setSavedMessage(''), 3000)
    } catch {
      setSavedMessage('Error al guardar. Intenta de nuevo.')
      setTimeout(() => setSavedMessage(''), 4000)
    } finally {
      setIsSaving(false)
    }
  }

  const formProps = { onSave: handleSave, isSaving, defaultValues: savedData ?? undefined }
  // Re-mount del form cuando los defaults cambian asincrónicamente
  const formKey = `${ovaId}-${phaseSlug}-${savedData ? 'loaded' : 'empty'}`

  // Fecha del último guardado
  const lastUpdated =
    savedData && typeof savedData.updatedAt === 'string'
      ? new Date(savedData.updatedAt).toLocaleString('es-CO', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : null

  return (
    <div className="min-h-screen bg-[#f0ede6]">
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
              Fase {phaseIdx + 1} de {PHASES.length}
              {isTeacher && ova ? (
                <span className="ml-2 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200">
                  Modo docente · Revisando "{ova.title}"
                </span>
              ) : null}
            </p>
            <h1 className="mt-0.5 text-2xl font-bold text-stone-800">{phaseConfig.label}</h1>
            <p className="mt-1 text-sm text-stone-500">{phaseConfig.objective}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* Vista previa: ambos roles */}
            <Link
              to={`/ova/${ovaId}/preview`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-50"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Vista previa
            </Link>

            {/* Solo el estudiante puede reiniciar su OVA */}
            {!isTeacher && (
              <button
                type="button"
                onClick={() => setIsResetOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
                  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
                </svg>
                Reiniciar OVA
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          <aside>
            <div className="sticky top-20 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400 px-1">
                Fases ADDIE
              </p>
              <PhaseNav ovaId={ovaId} currentSlug={currentSlug} />
            </div>
          </aside>

          <main className="flex flex-col gap-6">
            {isLoading ? (
              /* Loading común a ambos roles */
              <div className="flex items-center justify-center rounded-2xl bg-white py-16 shadow-sm ring-1 ring-stone-200">
                <svg className="size-8 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </div>
            ) : isTeacher ? (
              /* ─── VISTA DEL DOCENTE ─── */
              <>
                <PhaseDataReadOnly data={savedData} fase={currentSlug} />
                {ova ? (
                  <PhaseFiles
                    idOVA={ovaId}
                    fase={currentSlug}
                    canEdit={false}
                    idEstudiante={ova.idEstudiante}
                  />
                ) : null}
                {ova ? (
                  <InstructorEvalPanel
                    idOVA={ovaId}
                    fase={currentSlug}
                    idEstudiante={ova.idEstudiante}
                  />
                ) : null}
              </>
            ) : (
              /* ─── VISTA DEL ESTUDIANTE ─── */
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
                <div className="mb-6 rounded-xl bg-brand-50 border border-brand-100 p-4">
                  <p className="text-sm font-medium text-brand-800">{phaseConfig.description}</p>
                </div>

                {/* Feedback del docente para esta fase, si existe */}
                <EvaluationFeedback idOVA={ovaId} fase={currentSlug} />

                {savedMessage && (
                  <div className={[
                    'mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ring-1',
                    savedMessage.startsWith('Error')
                      ? 'bg-red-50 text-red-700 ring-red-200'
                      : 'bg-brand-50 text-brand-700 ring-brand-200',
                  ].join(' ')}>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 shrink-0">
                      {savedMessage.startsWith('Error') ? (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      )}
                    </svg>
                    {savedMessage}
                  </div>
                )}

                {lastUpdated ? (
                  <p className="mb-3 flex items-center gap-1.5 text-xs text-stone-500">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5 text-brand-500">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    Última actualización: {lastUpdated}
                  </p>
                ) : null}

                {currentSlug === 'analisis'       && <AnalysisForm       key={formKey} {...formProps} />}
                {currentSlug === 'diseno'          && <DesignForm          key={formKey} {...formProps} />}
                {currentSlug === 'desarrollo'      && <DevelopmentForm     key={formKey} {...formProps} />}
                {currentSlug === 'implementacion'  && <ImplementationForm  key={formKey} {...formProps} />}
                {currentSlug === 'evaluacion'      && <EvaluationForm      key={formKey} {...formProps} />}

                {/* Archivos adjuntos de esta fase (al final del formulario, fuera del onSubmit) */}
                {ova && user?.id ? (
                  <div className="mt-6">
                    <PhaseFiles
                      idOVA={ovaId}
                      fase={currentSlug}
                      canEdit={user.id === ova.idEstudiante}
                      idEstudiante={ova.idEstudiante}
                    />
                  </div>
                ) : null}
              </div>
            )}

            {/* Navegación entre fases — común a ambos roles */}
            <div className="flex items-center justify-between">
              {prevPhase ? (
                <Link
                  to={`/ova/${ovaId}/fase/${prevPhase.slug}`}
                  className="flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-700"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
                    <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 010 1.06L8.06 10l3.72 3.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z" clipRule="evenodd" />
                  </svg>
                  Fase anterior: {prevPhase.label}
                </Link>
              ) : <span />}

              {nextPhase && (
                <Link
                  to={`/ova/${ovaId}/fase/${nextPhase.slug}`}
                  className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
                >
                  Siguiente: {nextPhase.label}
                  <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
                    <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 010-1.06z" clipRule="evenodd" />
                  </svg>
                </Link>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Reset solo aplica al estudiante, pero el modal queda controlado igual */}
      <ResetOvaModal
        open={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        ovaId={ovaId}
      />
    </div>
  )
}
