import { z } from 'zod'

export const analysisSchema = z.object({
  contextoEducativo:       z.string().min(20, 'Describe el contexto con al menos 20 caracteres'),
  necesidadAprendizaje:    z.string().min(20, 'Describe la necesidad con al menos 20 caracteres'),
  publicoObjetivo:         z.string().min(5,  'Indica el público objetivo'),
  conocimientosPrevios:    z.string().min(10, 'Describe los conocimientos previos necesarios'),
  herramientas:            z.array(z.string()).min(1, 'Selecciona al menos una herramienta'),
})

export const designSchema = z.object({
  objetivoAprendizaje:     z.string().min(20, 'El objetivo debe tener al menos 20 caracteres'),
  estructuraOva:           z.enum(['lineal', 'ramificada', 'mixta'], { message: 'Selecciona una estructura' }),
  estrategiaPedagogica:    z.string().min(1, 'Selecciona una estrategia'),
  indicadoresEvaluacion:   z.string().min(15, 'Describe los indicadores de evaluación'),
  tiempoEstimado:          z.number({ message: 'Ingresa el tiempo en minutos' }).min(10, 'Mínimo 10 minutos').max(480, 'Máximo 480 minutos'),
})

export const developmentSchema = z.object({
  tiposContenido:          z.array(z.string()).min(1, 'Selecciona al menos un tipo de contenido'),
  descripcionContenido:    z.string().min(20, 'Describe el contenido con al menos 20 caracteres'),
  recursosNecesarios:      z.string().min(10, 'Lista los recursos necesarios'),
  herramientaDesarrollo:   z.string().min(1, 'Selecciona una herramienta'),
  estadoAvance:            z.enum(['inicio', 'proceso', 'completado'], { message: 'Indica el estado de avance' }),
})

export const implementationSchema = z.object({
  plataformaPublicacion:   z.string().min(1, 'Selecciona una plataforma'),
  fechaImplementacion:     z.string().min(1, 'Indica la fecha de implementación'),
  grupoObjetivo:           z.string().min(3, 'Describe el grupo objetivo'),
  requisitosTecnicos:      z.string().min(10, 'Lista los requisitos técnicos'),
  planComunicacion:        z.string().min(15, 'Describe cómo comunicarás el lanzamiento'),
})

export const evaluationSchema = z.object({
  tiposEvaluacion:         z.array(z.string()).min(1, 'Selecciona al menos un tipo de evaluación'),
  criteriosEvaluacion:     z.string().min(20, 'Define los criterios de evaluación'),
  instrumentos:            z.array(z.string()).min(1, 'Selecciona al menos un instrumento'),
  resultadosEsperados:     z.string().min(15, 'Describe los resultados esperados'),
  planMejora:              z.string().min(15, 'Describe el plan de mejora continua'),
})

export type AnalysisFormValues      = z.infer<typeof analysisSchema>
export type DesignFormValues         = z.infer<typeof designSchema>
export type DevelopmentFormValues    = z.infer<typeof developmentSchema>
export type ImplementationFormValues = z.infer<typeof implementationSchema>
export type EvaluationFormValues     = z.infer<typeof evaluationSchema>
