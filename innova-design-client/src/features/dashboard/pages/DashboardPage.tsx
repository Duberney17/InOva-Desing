import { useCurrentUser } from '@/store/auth.store'
import { StudentDashboardPage } from './StudentDashboardPage'
import { TeacherDashboardPage } from './TeacherDashboardPage'

export function DashboardPage() {
  const user = useCurrentUser()

  if (user?.rol === 'docente') return <TeacherDashboardPage />
  return <StudentDashboardPage />
}
