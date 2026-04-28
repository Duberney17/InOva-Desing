import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InstructorEvaluationDocument = HydratedDocument<InstructorEvaluation>;

@Schema({ timestamps: true })
export class InstructorEvaluation {
  @Prop({ required: true })
  idOVA: string;

  @Prop({ required: true })
  idEstudiante: string;

  @Prop({ required: true })
  idDocente: string;

  /**
   * Fase ADDIE evaluada: 'analisis' | 'diseno' | 'desarrollo' | 'implementacion' | 'evaluacion'
   */
  @Prop({ required: true, enum: ['analisis', 'diseno', 'desarrollo', 'implementacion', 'evaluacion'] })
  fase: string;

  /**
   * Estado de la evaluación: 'pendiente' | 'aprobado' | 'rechazado'
   */
  @Prop({ default: 'pendiente', enum: ['pendiente', 'aprobado', 'rechazado'] })
  estado: string;

  @Prop({ default: '' })
  observaciones: string;
}

export const InstructorEvaluationSchema = SchemaFactory.createForClass(InstructorEvaluation);
