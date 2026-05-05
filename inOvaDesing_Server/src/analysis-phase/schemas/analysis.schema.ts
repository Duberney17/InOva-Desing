import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnalysisPhaseDocument = HydratedDocument<AnalysisPhase>;

@Schema({ timestamps: true })
export class AnalysisPhase {
  @Prop({ required: true })
  idOVA: string;

  @Prop({ default: '' })
  contextoEducativo: string;

  @Prop({ default: '' })
  necesidadAprendizaje: string;

  @Prop({ default: '' })
  publicoObjetivo: string;

  @Prop({ default: '' })
  conocimientosPrevios: string;

  @Prop({ type: [String], default: [] })
  herramientas: string[];
}

export const AnalysisPhaseSchema = SchemaFactory.createForClass(AnalysisPhase);
