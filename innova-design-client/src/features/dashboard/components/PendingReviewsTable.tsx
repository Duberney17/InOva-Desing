import { useNavigate } from 'react-router-dom'
import type { PendingReview } from '../types/dashboard.types'

interface PendingReviewsTableProps {
  reviews: PendingReview[]
}

export function PendingReviewsTable({ reviews }: PendingReviewsTableProps) {
  const navigate = useNavigate()

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-stone-200">
        <p className="text-sm font-medium text-stone-500">No hay entregas pendientes de revisión.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100">
        <h3 className="text-base font-semibold text-stone-800">Entregas por evaluar</h3>
      </div>

      <ul className="divide-y divide-stone-50">
        {reviews.map((review) => (
          <li key={review.id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-stone-50 transition-colors">
            <div className="flex items-center gap-4 min-w-0">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
                {review.studentName.split(' ').slice(0, 2).map((w) => w[0]).join('')}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-stone-800 truncate">{review.studentName}</p>
                <p className="text-xs text-stone-400 truncate">{review.ovaTitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right hidden sm:block">
                <span className="inline-block rounded-md bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
                  {review.phase}
                </span>
                <p className="mt-1 text-xs text-stone-400">{review.submittedAt}</p>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/evaluacion/${review.id}`)}
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-700"
              >
                Evaluar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
