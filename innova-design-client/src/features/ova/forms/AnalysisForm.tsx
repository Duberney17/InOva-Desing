import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { analysisSchema, type AnalysisFormValues } from '../schemas/phase.schemas'
import { PhaseFormShell } from '../components/PhaseFormShell'
import { Textarea } from '../components/fields/Textarea'
import { TextInput } from '../components/fields/TextInput'
import { CheckboxGroup } from '../components/fields/CheckboxGroup'

const TOOLS = ['PC / Laptop', 'Tablet', 'Smartphone', 'Proyector', 'Sin restricción']

interface AnalysisFormProps {
  defaultValues?: Partial<AnalysisFormValues>
  onSave: (data: AnalysisFormValues) => void
  isSaving?: boolean
}

export function AnalysisForm({ defaultValues, onSave, isSaving }: AnalysisFormProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<AnalysisFormValues>({
    resolver: zodResolver(analysisSchema),
    defaultValues,
  })

  return (
    <PhaseFormShell onSubmit={handleSubmit(onSave)} isSaving={isSaving}>
      <Textarea
        label="Contexto educativo"
        hint="¿En qué nivel, área o institución se usará este OVA?"
        error={errors.contextoEducativo?.message}
        rows={4}
        {...register('contextoEducativo')}
      />

      <Textarea
        label="Problema o necesidad de aprendizaje"
        hint="¿Qué dificultad o brecha de aprendizaje busca resolver?"
        error={errors.necesidadAprendizaje?.message}
        rows={4}
        {...register('necesidadAprendizaje')}
      />

      <TextInput
        label="Público objetivo"
        hint="Ej: Estudiantes de grado 5°, entre 10 y 12 años"
        error={errors.publicoObjetivo?.message}
        {...register('publicoObjetivo')}
      />

      <Textarea
        label="Conocimientos previos requeridos"
        hint="¿Qué sabe o debe saber el estudiante antes de usar el OVA?"
        error={errors.conocimientosPrevios?.message}
        rows={3}
        {...register('conocimientosPrevios')}
      />

      <Controller
        name="herramientas"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <CheckboxGroup
            label="Herramientas disponibles"
            hint="Dispositivos con los que contará el estudiante"
            options={TOOLS}
            value={field.value}
            onChange={field.onChange}
            error={errors.herramientas?.message}
          />
        )}
      />
    </PhaseFormShell>
  )
}
