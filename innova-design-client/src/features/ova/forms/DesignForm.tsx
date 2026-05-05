import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { designSchema, type DesignFormValues } from '../schemas/phase.schemas'
import { PhaseFormShell } from '../components/PhaseFormShell'
import { Textarea } from '../components/fields/Textarea'
import { TextInput } from '../components/fields/TextInput'
import { RadioGroup } from '../components/fields/RadioGroup'
import { SelectInput } from '../components/fields/SelectInput'

const STRUCTURES = [
  { value: 'lineal',      label: 'Lineal',      description: 'Contenido en secuencia fija' },
  { value: 'ramificada',  label: 'Ramificada',  description: 'El estudiante elige su ruta' },
  { value: 'mixta',       label: 'Mixta',        description: 'Combinación de ambas' },
]

const STRATEGIES = [
  'Aprendizaje basado en problemas (ABP)',
  'Gamificación',
  'Aprendizaje colaborativo',
  'Aula invertida (Flipped Classroom)',
  'Estudio de caso',
  'Aprendizaje por proyectos',
]

interface DesignFormProps {
  defaultValues?: Partial<DesignFormValues>
  onSave: (data: DesignFormValues) => void
  isSaving?: boolean
}

export function DesignForm({ defaultValues, onSave, isSaving }: DesignFormProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<DesignFormValues>({
    resolver: zodResolver(designSchema),
    defaultValues,
  })

  return (
    <PhaseFormShell onSubmit={handleSubmit(onSave)} isSaving={isSaving}>
      <Textarea
        label="Objetivo de aprendizaje"
        hint="Usa verbos de la Taxonomía de Bloom. Ej: 'El estudiante será capaz de identificar...'"
        error={errors.objetivoAprendizaje?.message}
        rows={4}
        {...register('objetivoAprendizaje')}
      />

      <Controller
        name="estructuraOva"
        control={control}
        render={({ field }) => (
          <RadioGroup
            label="Estructura del OVA"
            options={STRUCTURES}
            value={field.value}
            onChange={field.onChange}
            error={errors.estructuraOva?.message}
          />
        )}
      />

      <Controller
        name="estrategiaPedagogica"
        control={control}
        render={({ field }) => (
          <SelectInput
            label="Estrategia pedagógica"
            options={STRATEGIES}
            value={field.value}
            onChange={field.onChange}
            error={errors.estrategiaPedagogica?.message}
          />
        )}
      />

      <Textarea
        label="Indicadores de evaluación"
        hint="¿Cómo sabrás que el estudiante logró el objetivo?"
        error={errors.indicadoresEvaluacion?.message}
        rows={3}
        {...register('indicadoresEvaluacion')}
      />

      <TextInput
        label="Tiempo estimado (minutos)"
        type="number"
        hint="Tiempo total que tomará completar el OVA"
        error={errors.tiempoEstimado?.message}
        {...register('tiempoEstimado', { valueAsNumber: true })}
      />
    </PhaseFormShell>
  )
}
