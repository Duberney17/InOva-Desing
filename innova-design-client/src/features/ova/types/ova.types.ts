import type { PhaseSlug } from '@/features/dashboard/types/dashboard.types'

export interface PhaseConfig {
  slug: PhaseSlug
  label: string
  description: string
  objective: string
}

export const PHASES: PhaseConfig[] = [
  {
    slug: 'analisis',
    label: 'Análisis',
    description: 'Identifica el contexto educativo, la necesidad de aprendizaje y el público objetivo.',
    objective: 'Definir quién aprende, qué necesita y en qué contexto se usará el OVA.',
  },
  {
    slug: 'diseno',
    label: 'Diseño',
    description: 'Establece los objetivos de aprendizaje, la estructura y la estrategia pedagógica.',
    objective: 'Diseñar el mapa de contenidos y la ruta de aprendizaje del OVA.',
  },
  {
    slug: 'desarrollo',
    label: 'Desarrollo',
    description: 'Crea y organiza los contenidos, actividades y recursos del OVA.',
    objective: 'Producir todos los materiales que compondrán el OVA.',
  },
  {
    slug: 'implementacion',
    label: 'Implementación',
    description: 'Publica el OVA en la plataforma educativa y prepara el lanzamiento.',
    objective: 'Hacer disponible el OVA para los estudiantes en el entorno real.',
  },
  {
    slug: 'evaluacion',
    label: 'Evaluación',
    description: 'Mide la efectividad del OVA y planifica mejoras continuas.',
    objective: 'Validar si el OVA cumplió sus objetivos de aprendizaje.',
  },
]

export const PHASE_INDEX: Record<PhaseSlug, number> = {
  analisis:       0,
  diseno:         1,
  desarrollo:     2,
  implementacion: 3,
  evaluacion:     4,
}
