import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OvaDocument = HydratedDocument<Ova>;

@Schema({ timestamps: true })
export class Ova {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  /**
   * ID del estudiante que creó este OVA (MongoDB _id del User)
   */
  @Prop({ required: true })
  idEstudiante: string;

  @Prop({ default: 'en_progreso', enum: ['en_progreso', 'completado', 'revisado'] })
  state: string;
}

// Fix al typo original: OvaShema → OvaSchema
export const OvaSchema = SchemaFactory.createForClass(Ova);
