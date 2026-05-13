import type { Ova, OvaStatus } from '../types/dashboard.types'

const EVAL_STYLES = {
  pendiente: 'text-amber-600',
  aprobado:  'text-brand-600',
  rechazado: 'text-red-600',
}

const EVAL_LABEL = {
  pendiente: 'Pendiente',
  aprobado:  'Aprobado',
  rechazado: 'Rechazado',
}

const STATUS_LABEL: Record<OvaStatus, string> = {
  en_progreso: 'En progreso',
  completado:  'Completado',
  revisado:    'Finalizado',
  borrador:    'Borrador',
}

const STATUS_COLOR: Record<OvaStatus, string> = {
  en_progreso: 'text-amber-700',
  completado:  'text-brand-700',
  revisado:    'text-purple-700',
  borrador:    'text-stone-600',
}

interface OvaSummaryPanelProps {
  ova: Ova
}

export function OvaSummaryPanel({ ova }: OvaSummaryPanelProps) {
  const evalStatus = ova.teacherEvaluation ?? 'pendiente'

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
      <h3 className="mb-4 text-base font-semibold text-stone-800">Resumen del OVA</h3>

      <dl className="space-y-3">
        <Row label="Fases completadas">
          <span className="font-semibold text-brand-600">
            {ova.completedPhases}
            <span className="font-normal text-stone-400">/{ova.totalPhases}</span>
          </span>
        </Row>

        <Row label="Estado">
          <span className={`font-semibold ${STATUS_COLOR[ova.status]}`}>
            {STATUS_LABEL[ova.status]}
          </span>
        </Row>

        <Row label="Evaluación docente">
          <span className={['font-semibold', EVAL_STYLES[evalStatus]].join(' ')}>
            {EVAL_LABEL[evalStatus]}
          </span>
        </Row>

        <Row label="Última actividad">
          <span className="font-semibold text-stone-800">{ova.lastActivity}</span>
        </Row>
      </dl>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-stone-50 pb-3 last:border-0 last:pb-0">
      <dt className="text-sm text-stone-500">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  )
}
