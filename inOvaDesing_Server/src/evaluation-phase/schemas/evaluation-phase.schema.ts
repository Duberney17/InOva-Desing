import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EvaluationPhaseDocument = HydratedDocument<EvaluationPhase>;

@Schema({ timestamps: true })
export class EvaluationPhase {
  @Prop({ required: true })
  idOVA: string;

  @Prop({ type: [String], default: [] })
  tiposEvaluacion: string[];

  @Prop({ default: '' })
  criteriosEvaluacion: string;

  @Prop({ type: [String], default: [] })
  instrumentos: string[];

  @Prop({ default: '' })
  resultadosEsperados: string;

  @Prop({ default: '' })
  planMejora: string;
}

export const EvaluationPhaseSchema = SchemaFactory.createForClass(EvaluationPhase);
