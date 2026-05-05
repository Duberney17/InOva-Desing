import { useCurrentUser } from '@/store/auth.store'
import { DashboardHeader } from '../components/DashboardHeader'
import { TeacherStatsBar } from '../components/TeacherStatsBar'
import { PendingReviewsTable } from '../components/PendingReviewsTable'
import { teacherMockData } from '../data/dashboard.mock'

export function TeacherDashboardPage() {
  const user = useCurrentUser()
  const { pendingReviews, totalStudents, totalOvas, approvedThisMonth } = teacherMockData
  const firstName = user?.name.split(' ')[0] ?? 'docente'

  return (
    <div className="min-h-screen bg-[#f0ede6]">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-800">
            Hola, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Revisa el progreso de tus estudiantes y evalúa sus avances.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <TeacherStatsBar
            totalStudents={totalStudents}
            totalOvas={totalOvas}
            approvedThisMonth={approvedThisMonth}
            pendingCount={pendingReviews.length}
          />

          <PendingReviewsTable reviews={pendingReviews} />
        </div>
      </main>
    </div>
  )
}
