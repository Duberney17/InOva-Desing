import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OvaFileDocument = HydratedDocument<OvaFile>;

/**
 * Metadata de un archivo subido por un estudiante a un OVA.
 * El archivo físico vive en Cloudflare R2; aquí guardamos la referencia.
 *
 * Campos:
 *  - idOVA: a qué OVA pertenece
 *  - idFase: opcional, fase ADDIE asociada (analisis, diseno, ...)
 *  - idEstudiante: quién subió el archivo (para permisos/auditoria)
 *  - originalName: nombre original que el usuario subió ("mi tarea.pdf")
 *  - storageKey: la clave en R2 (ej: "ova/<id>/analisis/<uuid>-tarea.pdf").
 *                Se usa para borrar en R2.
 *  - url: URL pública (o firmada) para acceder al archivo
 *  - mimeType: ej "application/pdf", "image/png"
 *  - size: bytes
 */
@Schema({ timestamps: true })
export class OvaFile {
  @Prop({ required: true, index: true })
  idOVA: string;

  @Prop({
    type: String,
    enum: ['analisis', 'diseno', 'desarrollo', 'implementacion', 'evaluacion', null],
    default: null,
  })
  idFase: string | null;

  @Prop({ required: true })
  idEstudiante: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true, unique: true })
  storageKey: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  size: number;
}

export const OvaFileSchema = SchemaFactory.createForClass(OvaFile);
