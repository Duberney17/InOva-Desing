import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { developmentSchema, type DevelopmentFormValues } from '../schemas/phase.schemas'
import { PhaseFormShell } from '../components/PhaseFormShell'
import { Textarea } from '../components/fields/Textarea'
import { CheckboxGroup } from '../components/fields/CheckboxGroup'
import { RadioGroup } from '../components/fields/RadioGroup'
import { SelectInput } from '../components/fields/SelectInput'

const CONTENT_TYPES = ['Video', 'Texto / Lectura', 'Infografía', 'Audio / Podcast', 'Ejercicios interactivos', 'Evaluación / Quiz']

const TOOLS = ['H5P', 'Moodle', 'Google Sites', 'Canva', 'PowerPoint', 'Adobe Express', 'Genially', 'Otro']

const PROGRESS_STATES = [
  { value: 'inicio',      label: 'En inicio',   description: 'Planificación sin producción aún' },
  { value: 'proceso',     label: 'En proceso',  description: 'Producción parcialmente avanzada' },
  { value: 'completado',  label: 'Completado',  description: 'Todos los recursos listos'       },
]

interface DevelopmentFormProps {
  defaultValues?: Partial<DevelopmentFormValues>
  onSave: (data: DevelopmentFormValues) => void
  isSaving?: boolean
}

export function DevelopmentForm({ defaultValues, onSave, isSaving }: DevelopmentFormProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<DevelopmentFormValues>({
    resolver: zodResolver(developmentSchema),
    defaultValues,
  })

  return (
    <PhaseFormShell onSubmit={handleSubmit(onSave)} isSaving={isSaving}>
      <Controller
        name="tiposContenido"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <CheckboxGroup
            label="Tipos de contenido"
            hint="¿Qué formatos usarás en el OVA?"
            options={CONTENT_TYPES}
            value={field.value}
            onChange={field.onChange}
            error={errors.tiposContenido?.message}
          />
        )}
      />

      <Textarea
        label="Descripción del contenido"
        hint="Describe brevemente qué incluirá cada módulo o sección"
        error={errors.descripcionContenido?.message}
        rows={4}
        {...register('descripcionContenido')}
      />

      <Textarea
        label="Recursos necesarios"
        hint="Software, imágenes, grabaciones, datos u otros materiales que necesitas"
        error={errors.recursosNecesarios?.message}
        rows={3}
        {...register('recursosNecesarios')}
      />

      <Controller
        name="herramientaDesarrollo"
        control={control}
        render={({ field }) => (
          <SelectInput
            label="Herramienta de desarrollo"
            hint="Plataforma o software principal para crear el OVA"
            options={TOOLS}
            value={field.value}
            onChange={field.onChange}
            error={errors.herramientaDesarrollo?.message}
          />
        )}
      />

      <Controller
        name="estadoAvance"
        control={control}
        render={({ field }) => (
          <RadioGroup
            label="Estado de avance"
            options={PROGRESS_STATES}
            value={field.value}
            onChange={field.onChange}
            error={errors.estadoAvance?.message}
          />
        )}
      />
    </PhaseFormShell>
  )
}
