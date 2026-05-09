import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OvaFile, OvaFileDocument } from './schemas/ova-file.schema';
import { R2Service } from './r2.service';
import { CreateOvaFileDto } from './dto/create-ova-file.dto';

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIMES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
]);

@Injectable()
export class OvaFilesService {
  constructor(
    @InjectModel(OvaFile.name) private model: Model<OvaFileDocument>,
    private readonly r2: R2Service,
  ) {}

  /**
   * Sube un archivo a R2 y guarda la metadata en Mongo.
   * Valida tamaño y mimetype antes de subir.
   */
  async upload(
    file: { originalname: string; mimetype: string; buffer: Buffer; size: number },
    dto: CreateOvaFileDto,
  ) {
    if (!file) {
      throw new BadRequestException('No se recibió archivo');
    }
    if (file.size > MAX_BYTES) {
      throw new BadRequestException(
        `El archivo es muy grande (máximo ${MAX_BYTES / 1024 / 1024} MB)`,
      );
    }
    if (!ALLOWED_MIMES.has(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido: ${file.mimetype}`,
      );
    }

    // Path lógico dentro del bucket: ova/<id>/<fase|sin-fase>
    const folder = `ova/${dto.idOVA}/${dto.idFase ?? 'sin-fase'}`;
    const { storageKey, url } = await this.r2.uploadFile(folder, file);

    return this.model.create({
      idOVA: dto.idOVA,
      idEstudiante: dto.idEstudiante,
      idFase: dto.idFase ?? null,
      originalName: file.originalname,
      storageKey,
      url,
      mimeType: file.mimetype,
      size: file.size,
    });
  }

  /** Todos los archivos de un OVA. */
  findByOva(idOVA: string) {
    return this.model.find({ idOVA }).sort({ createdAt: -1 }).exec();
  }

  /** Archivos de una fase específica de un OVA. */
  findByOvaAndFase(idOVA: string, idFase: string) {
    return this.model.find({ idOVA, idFase }).sort({ createdAt: -1 }).exec();
  }

  /**
   * Borra el archivo de R2 + el documento de Mongo.
   * Si el doc no existe, 404. Si R2 falla, no rompemos (la UI puede reintentar).
   */
  async remove(id: string) {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException('Archivo no encontrado');
    await this.r2.deleteFile(doc.storageKey);
    await this.model.deleteOne({ _id: id }).exec();
    return { deleted: true, id };
  }
}
