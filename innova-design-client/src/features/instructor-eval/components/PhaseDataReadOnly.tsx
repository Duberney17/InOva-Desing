import type { PhaseSlug } from '@/features/dashboard/types/dashboard.types'

interface PhaseDataReadOnlyProps {
  /** Datos crudos guardados por el estudiante para la fase. */
  data: Record<string, unknown> | null
  /** Slug de la fase (para mostrar título contextual). */
  fase: PhaseSlug
}

// Campos que NO se muestran (metadata del backend)
const HIDDEN_KEYS = new Set(['_id', 'idOVA', 'createdAt', 'updatedAt', '__v'])

/**
 * Etiquetas legibles por campo. Si no está en el mapa, se genera
 * automáticamente a partir del nombre camelCase.
 */
const FIELD_LABELS: Record<string, string> = {
  contextoEducativo:    'Contexto educativo',
  necesidadAprendizaje: 'Necesidad de aprendizaje',
  publicoObjetivo:      'Público objetivo',
  conocimientosPrevios: 'Conocimientos previos',
  herramientas:         'Herramientas disponibles',
  objetivoAprendizaje:  'Objetivo de aprendizaje',
  estructuraOva:        'Estructura del OVA',
  estrategiaPedagogica: 'Estrategia pedagógica',
  indicadoresEvaluacion: 'Indicadores de evaluación',
  tiempoEstimado:       'Tiempo estimado (min)',
  tiposContenido:       'Tipos de contenido',
  descripcionContenido: 'Descripción del contenido',
  recursosNecesarios:   'Recursos necesarios',
  herramientaDesarrollo: 'Herramienta de desarrollo',
  estadoAvance:         'Estado de avance',
  plataformaPublicacion: 'Plataforma de publicación',
  fechaImplementacion:  'Fecha de implementación',
  grupoObjetivo:        'Grupo objetivo',
  requisitosTecnicos:   'Requisitos técnicos',
  planComunicacion:     'Plan de comunicación',
  tiposEvaluacion:      'Tipos de evaluación',
  criteriosEvaluacion:  'Criterios de evaluación',
  instrumentos:         'Instrumentos',
  resultadosEsperados:  'Resultados esperados',
  planMejora:           'Plan de mejora',
}

/** Convierte `camelCase` → "Camel Case" (fallback si no está en el mapa). */
function humanize(key: string): string {
  const spaced = key.replace(/([A-Z])/g, ' $1').toLowerCase()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

/**
 * Pinta los datos guardados por el estudiante en formato lectura.
 * Cada par key/value se convierte en una "row" con label + valor formateado.
 */
export function PhaseDataReadOnly({ data, fase }: PhaseDataReadOnlyProps) {
  if (!data) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-stone-200">
        <p className="text-sm text-stone-500">
          El estudiante aún no ha guardado información para la fase{' '}
          <strong className="text-stone-700">{fase}</strong>.
        </p>
      </div>
    )
  }

  const entries = Object.entries(data).filter(
    ([k, v]) => !HIDDEN_KEYS.has(k) && v !== null && v !== undefined && v !== '',
  )

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-stone-200">
        <p className="text-sm text-stone-500">El estudiante no ha llenado campos en esta fase.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="mb-4 flex items-center gap-2 border-b border-stone-100 pb-3">
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 text-brand-600">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
        <h3 className="text-sm font-semibold text-stone-700">
          Respuestas del estudiante
        </h3>
      </div>

      <dl className="flex flex-col gap-4">
        {entries.map(([key, value]) => {
          const label = FIELD_LABELS[key] ?? humanize(key)
          return (
            <div key={key}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                {label}
              </dt>
              <dd className="mt-1 text-sm text-stone-800">
                <FieldValue value={value} />
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}

/** Renderiza un valor según su tipo. */
function FieldValue({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-stone-400">—</span>
    return (
      <ul className="flex flex-wrap gap-1.5">
        {value.map((v, i) => (
          <li
            key={`${String(v)}-${i}`}
            className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700"
          >
            {String(v)}
          </li>
        ))}
      </ul>
    )
  }
  if (typeof value === 'string') {
    return <p className="whitespace-pre-wrap leading-relaxed">{value}</p>
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return <span>{String(value)}</span>
  }
  return <span className="text-stone-400">—</span>
}
