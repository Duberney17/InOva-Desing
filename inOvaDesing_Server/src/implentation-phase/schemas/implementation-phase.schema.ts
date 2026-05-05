import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ImplementationPhaseDocument = HydratedDocument<ImplementationPhase>;

@Schema({ timestamps: true })
export class ImplementationPhase {
  @Prop({ required: true })
  idOVA: string;

  @Prop({ default: '' })
  plataformaPublicacion: string;

  @Prop({ default: '' })
  fechaImplementacion: string;

  @Prop({ default: '' })
  grupoObjetivo: string;

  @Prop({ default: '' })
  requisitosTecnicos: string;

  @Prop({ default: '' })
  planComunicacion: string;
}

export const ImplementationPhaseSchema = SchemaFactory.createForClass(ImplementationPhase);
