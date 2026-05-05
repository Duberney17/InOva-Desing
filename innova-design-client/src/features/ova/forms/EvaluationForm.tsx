import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { evaluationSchema, type EvaluationFormValues } from '../schemas/phase.schemas'
import { PhaseFormShell } from '../components/PhaseFormShell'
import { Textarea } from '../components/fields/Textarea'
import { CheckboxGroup } from '../components/fields/CheckboxGroup'

const EVAL_TYPES = ['Diagnóstica', 'Formativa', 'Sumativa', 'Autoevaluación', 'Coevaluación']

const INSTRUMENTS = ['Rúbrica', 'Encuesta de satisfacción', 'Quiz / Cuestionario', 'Lista de cotejo', 'Portafolio', 'Foro de reflexión']

interface EvaluationFormProps {
  defaultValues?: Partial<EvaluationFormValues>
  onSave: (data: EvaluationFormValues) => void
  isSaving?: boolean
}

export function EvaluationForm({ defaultValues, onSave, isSaving }: EvaluationFormProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationSchema),
    defaultValues,
  })

  return (
    <PhaseFormShell onSubmit={handleSubmit(onSave)} isSaving={isSaving}>
      <Controller
        name="tiposEvaluacion"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <CheckboxGroup
            label="Tipos de evaluación"
            hint="¿En qué momento y cómo evaluarás el aprendizaje?"
            options={EVAL_TYPES}
            value={field.value}
            onChange={field.onChange}
            error={errors.tiposEvaluacion?.message}
          />
        )}
      />

      <Textarea
        label="Criterios de evaluación"
        hint="Define los estándares que medirán el logro del objetivo de aprendizaje"
        error={errors.criteriosEvaluacion?.message}
        rows={4}
        {...register('criteriosEvaluacion')}
      />

      <Controller
        name="instrumentos"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <CheckboxGroup
            label="Instrumentos de evaluación"
            hint="Herramientas concretas que usarás para recoger evidencia"
            options={INSTRUMENTS}
            value={field.value}
            onChange={field.onChange}
            error={errors.instrumentos?.message}
          />
        )}
      />

      <Textarea
        label="Resultados esperados"
        hint="¿Qué porcentaje de logro o qué desempeño esperas de los estudiantes?"
        error={errors.resultadosEsperados?.message}
        rows={3}
        {...register('resultadosEsperados')}
      />

      <Textarea
        label="Plan de mejora"
        hint="Si los resultados no son los esperados, ¿qué ajustes harás al OVA?"
        error={errors.planMejora?.message}
        rows={3}
        {...register('planMejora')}
      />
    </PhaseFormShell>
  )
}
