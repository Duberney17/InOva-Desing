import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['docente', 'estudiante'] })
  rol: string;

  /**
   * Solo aplica para estudiantes: MongoDB _id del docente que los registró.
   */
  @Prop({ default: null })
  idDocente: string;

  @Prop({ default: true })
  state: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
