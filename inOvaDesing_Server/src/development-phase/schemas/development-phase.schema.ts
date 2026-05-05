import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DevelopmentPhaseDocument = HydratedDocument<DevelopmentPhase>;

@Schema({ timestamps: true })
export class DevelopmentPhase {
  @Prop({ required: true })
  idOVA: string;

  @Prop({ type: [String], default: [] })
  tiposContenido: string[];

  @Prop({ default: '' })
  descripcionContenido: string;

  @Prop({ default: '' })
  recursosNecesarios: string;

  @Prop({ default: '' })
  herramientaDesarrollo: string;

  @Prop({ default: 'inicio', enum: ['inicio', 'proceso', 'completado'] })
  estadoAvance: string;
}

export const DevelopmentPhaseSchema = SchemaFactory.createForClass(DevelopmentPhase);
