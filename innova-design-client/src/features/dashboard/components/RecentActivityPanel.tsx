import type { ActivityItem } from '../types/dashboard.types'

const DOT_STYLES = {
  success: 'bg-brand-500',
  warning: 'bg-amber-400',
  neutral: 'bg-stone-300',
}

interface RecentActivityPanelProps {
  items: ActivityItem[]
}

export function RecentActivityPanel({ items }: RecentActivityPanelProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
      <h3 className="mb-4 text-base font-semibold text-stone-800">Actividad reciente</h3>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <span className={['mt-1.5 size-2.5 shrink-0 rounded-full', DOT_STYLES[item.type]].join(' ')} />
            <div>
              <p className="text-sm font-medium text-stone-700 leading-tight">{item.description}</p>
              <p className="mt-0.5 text-xs text-stone-400">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
