interface Stat {
  label: string
  value: number | string
  accent?: boolean
}

interface TeacherStatsBarProps {
  totalStudents: number
  totalOvas: number
  approvedThisMonth: number
  pendingCount: number
}

export function TeacherStatsBar({ totalStudents, totalOvas, approvedThisMonth, pendingCount }: TeacherStatsBarProps) {
  const stats: Stat[] = [
    { label: 'Estudiantes',       value: totalStudents      },
    { label: 'OVAs en curso',     value: totalOvas          },
    { label: 'Aprobados este mes', value: approvedThisMonth  },
    { label: 'Por evaluar',        value: pendingCount, accent: true },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-400">{s.label}</p>
          <p className={['mt-1 text-3xl font-bold', s.accent ? 'text-amber-600' : 'text-stone-800'].join(' ')}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  )
}
