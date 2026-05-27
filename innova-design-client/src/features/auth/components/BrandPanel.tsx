/** Panel izquierdo de las pantallas de auth: brand + chips de fases ADDIE. */
const ADDIE_PHASES = [
  'Análisis',
  'Diseño',
  'Desarrollo',
  'Implementación',
  'Evaluación',
] as const

export function BrandPanel() {
  return (
    <div className="relative hidden h-full overflow-hidden rounded-3xl bg-linear-to-br from-brand-600 via-brand-700 to-brand-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
      {/* Decoración: dos círculos translúcidos en esquinas opuestas */}
      <div
        aria-hidden
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5 blur-2xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/5 blur-2xl"
      />

      {/* Header: logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
          <span className="text-lg font-bold">I</span>
        </div>
        <span className="text-lg font-semibold tracking-tight">
          InOva Design
        </span>
      </div>

      {/* Tagline + descripción */}
      <div className="relative z-10 max-w-md">
        <h1 className="font-serif text-4xl leading-tight">
          Diseña el futuro del{' '}
          <em className="font-serif italic text-brand-200">aprendizaje</em>{' '}
          digital
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/85">
          Crea Objetos Virtuales de Aprendizaje estructurados siguiendo el
          modelo pedagógico ADDIE.
        </p>
      </div>

      {/* Footer: chips de las 5 fases */}
      <div className="relative z-10">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
          Fases del modelo
        </span>
        <div className="mt-3 flex flex-wrap gap-2">
          {ADDIE_PHASES.map((phase) => (
            <span
              key={phase}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20 backdrop-blur"
            >
              {phase}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
