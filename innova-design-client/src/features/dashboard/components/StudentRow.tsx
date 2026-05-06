import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UserResponse } from '@/features/users/services/users.service'

export interface StudentOvaSummary {
  id: string
  title: string
  progress: number
  faseActual: string
  status: 'en_progreso' | 'completado' | 'revisado'
}

interface StudentRowProps {
  student: UserResponse
  ovas: StudentOvaSummary[]
  isLoadingOvas?: boolean
}

const STATUS_COLOR: Record<StudentOvaSummary['status'], string> = {
  en_progreso: 'text-amber-700 bg-amber-50 ring-amber-200',
  completado:  'text-brand-700 bg-brand-50 ring-brand-200',
  revisado:    'text-purple-700 bg-purple-50 ring-purple-200',
}

const STATUS_LABEL: Record<StudentOvaSummary['status'], string> = {
  en_progreso: 'En progreso',
  completado:  'Completado',
  revisado:    'Revisado',
}

/**
 * Fila colapsable de un estudiante.
 * Muestra nombre/email + cantidad de OVAs.
 * Al expandir, lista las OVAs con porcentaje y link para revisar la fase actual.
 */
export function StudentRow({ student, ovas, isLoadingOvas }: StudentRowProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-stone-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-stone-50"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-brand-200">
          {student.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-stone-800">{student.name}</p>
          <p className="truncate text-xs text-stone-500">{student.email}</p>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
            {isLoadingOvas ? '…' : `${ovas.length} OVA${ovas.length === 1 ? '' : 's'}`}
          </span>
        </div>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`size-4 text-stone-400 transition ${open ? 'rotate-180' : ''}`}
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-stone-100 px-4 py-3">
          {isLoadingOvas ? (
            <p className="py-2 text-xs text-stone-400">Cargando OVAs…</p>
          ) : ovas.length === 0 ? (
            <p className="py-2 text-xs text-stone-400">
              Este estudiante aún no ha creado ningún OVA.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {ovas.map((ova) => (
                <li key={ova.id}>
                  <Link
                    to={`/ova/${ova.id}/fase/${ova.faseActual}`}
                    className="flex items-center gap-3 rounded-lg border border-stone-200 px-3 py-2.5 transition hover:border-brand-300 hover:bg-brand-50/40"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-stone-800">{ova.title}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
                        <span>Fase actual: <strong className="text-stone-700">{ova.faseActual}</strong></span>
                        <span>·</span>
                        <span className="font-semibold text-brand-700">{ova.progress}%</span>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${STATUS_COLOR[ova.status]}`}>
                      {STATUS_LABEL[ova.status]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
