import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserProgressDocument = HydratedDocument<UserProgress>;

@Schema({ timestamps: true })
export class UserProgress {
  @Prop({ required: true })
  idOVA: string;

  @Prop({ required: true })
  idEstudiante: string;

  /**
   * Fases completadas. Cada fase se agrega al guardar (CU-7)
   * Valores posibles: 'analisis' | 'diseno' | 'desarrollo' | 'implementacion' | 'evaluacion'
   */
  @Prop({ type: [String], default: [] })
  fasesCompletadas: string[];

  /**
   * Fase en la que está trabajando actualmente
   */
  @Prop({ default: 'analisis' })
  faseActual: string;

  /**
   * Porcentaje calculado: (fasesCompletadas.length / 5) * 100
   */
  @Prop({ default: 0 })
  porcentaje: number;
}

export const UserProgressSchema = SchemaFactory.createForClass(UserProgress);
