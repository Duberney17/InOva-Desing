export type PhaseStatus = 'completed' | 'in_progress' | 'pending'
export type OvaStatus = 'en_progreso' | 'completado' | 'revisado' | 'borrador'
export type EvaluationStatus = 'pendiente' | 'aprobado' | 'rechazado'
export type ActivityType = 'success' | 'warning' | 'neutral'

export type PhaseSlug = 'analisis' | 'diseno' | 'desarrollo' | 'implementacion' | 'evaluacion'

export interface OvaPhase {
  slug: PhaseSlug
  label: string
  status: PhaseStatus
}

export interface Ova {
  id: string
  title: string
  createdAt: string
  status: OvaStatus
  progress: number
  phases: OvaPhase[]
  teacherEvaluation: EvaluationStatus | null
  lastActivity: string
  completedPhases: number
  totalPhases: number
}

export interface ActivityItem {
  id: string
  description: string
  time: string
  type: ActivityType
}

export interface StudentDashboardData {
  activeOva: Ova | null
  recentActivity: ActivityItem[]
}

export interface PendingReview {
  id: string
  studentName: string
  ovaTitle: string
  phase: string
  submittedAt: string
}

export interface TeacherDashboardData {
  pendingReviews: PendingReview[]
  totalStudents: number
  totalOvas: number
  approvedThisMonth: number
}
