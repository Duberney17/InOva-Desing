import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { implementationSchema, type ImplementationFormValues } from '../schemas/phase.schemas'
import { PhaseFormShell } from '../components/PhaseFormShell'
import { Textarea } from '../components/fields/Textarea'
import { TextInput } from '../components/fields/TextInput'
import { SelectInput } from '../components/fields/SelectInput'

const PLATFORMS = ['Moodle', 'Google Classroom', 'Microsoft Teams', 'Edmodo', 'Schoology', 'Canvas', 'Sitio Web propio', 'Otro']

interface ImplementationFormProps {
  defaultValues?: Partial<ImplementationFormValues>
  onSave: (data: ImplementationFormValues) => void
  isSaving?: boolean
}

export function ImplementationForm({ defaultValues, onSave, isSaving }: ImplementationFormProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<ImplementationFormValues>({
    resolver: zodResolver(implementationSchema),
    defaultValues,
  })

  return (
    <PhaseFormShell onSubmit={handleSubmit(onSave)} isSaving={isSaving}>
      <Controller
        name="plataformaPublicacion"
        control={control}
        render={({ field }) => (
          <SelectInput
            label="Plataforma de publicación"
            hint="¿Dónde estará disponible el OVA para los estudiantes?"
            options={PLATFORMS}
            value={field.value}
            onChange={field.onChange}
            error={errors.plataformaPublicacion?.message}
          />
        )}
      />

      <TextInput
        label="Fecha de implementación"
        type="date"
        hint="Fecha en que estará disponible para los estudiantes"
        error={errors.fechaImplementacion?.message}
        {...register('fechaImplementacion')}
      />

      <TextInput
        label="Grupo objetivo"
        hint="Ej: Grado 5° — Grupo A — Institución Educativa San José"
        error={errors.grupoObjetivo?.message}
        {...register('grupoObjetivo')}
      />

      <Textarea
        label="Requisitos técnicos"
        hint="Acceso a internet, navegador mínimo, software o plugins necesarios"
        error={errors.requisitosTecnicos?.message}
        rows={3}
        {...register('requisitosTecnicos')}
      />

      <Textarea
        label="Plan de comunicación"
        hint="¿Cómo informarás a los estudiantes sobre el OVA y su uso?"
        error={errors.planComunicacion?.message}
        rows={3}
        {...register('planComunicacion')}
      />
    </PhaseFormShell>
  )
}
