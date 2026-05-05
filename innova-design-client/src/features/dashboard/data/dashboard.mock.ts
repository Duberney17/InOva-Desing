import type { StudentDashboardData, TeacherDashboardData } from '../types/dashboard.types'

export const studentMockData: StudentDashboardData = {
  activeOva: {
    id: 'ova-001',
    title: 'Pensamiento Computacional en Primaria',
    createdAt: '6 de marzo de 2026',
    status: 'en_progreso',
    progress: 40,
    completedPhases: 2,
    totalPhases: 5,
    teacherEvaluation: 'pendiente',
    lastActivity: 'Hoy',
    phases: [
      { slug: 'analisis',        label: 'Análisis',        status: 'completed'   },
      { slug: 'diseno',          label: 'Diseño',          status: 'completed'   },
      { slug: 'desarrollo',      label: 'Desarrollo',      status: 'in_progress' },
      { slug: 'implementacion',  label: 'Implementación',  status: 'pending'     },
      { slug: 'evaluacion',      label: 'Evaluación',      status: 'pending'     },
    ],
  },
  recentActivity: [
    { id: '1', description: 'Fase de Diseño completada',           time: 'Hace 2 horas',    type: 'success' },
    { id: '2', description: 'Iniciaste la fase de Desarrollo',     time: 'Hace 30 minutos', type: 'warning' },
    { id: '3', description: 'Archivo adjunto subido en Análisis',  time: 'Ayer',            type: 'neutral' },
  ],
}

export const teacherMockData: TeacherDashboardData = {
  totalStudents: 24,
  totalOvas: 18,
  approvedThisMonth: 7,
  pendingReviews: [
    { id: 'r1', studentName: 'María González',  ovaTitle: 'Pensamiento Computacional en Primaria', phase: 'Análisis',   submittedAt: 'Hace 1 hora'    },
    { id: 'r2', studentName: 'Carlos Pérez',    ovaTitle: 'Fracciones con Objetos Cotidianos',      phase: 'Diseño',     submittedAt: 'Hace 3 horas'   },
    { id: 'r3', studentName: 'Laura Méndez',    ovaTitle: 'Ecosistemas Locales',                    phase: 'Desarrollo', submittedAt: 'Hace 1 día'     },
    { id: 'r4', studentName: 'Andrés Ruiz',     ovaTitle: 'Historia de Colombia Siglo XX',          phase: 'Análisis',   submittedAt: 'Hace 2 días'    },
  ],
}
