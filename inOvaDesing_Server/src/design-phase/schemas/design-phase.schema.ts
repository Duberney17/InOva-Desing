import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DesignPhaseDocument = HydratedDocument<DesignPhase>;

@Schema({ timestamps: true })
export class DesignPhase {
  @Prop({ required: true })
  idOVA: string;

  @Prop({ default: '' })
  objetivoAprendizaje: string;

  @Prop({ default: '' })
  estructuraOva: string;

  @Prop({ default: '' })
  estrategiaPedagogica: string;

  @Prop({ default: '' })
  indicadoresEvaluacion: string;

  @Prop({ default: 0 })
  tiempoEstimado: number;
}

export const DesignPhaseSchema = SchemaFactory.createForClass(DesignPhase);
