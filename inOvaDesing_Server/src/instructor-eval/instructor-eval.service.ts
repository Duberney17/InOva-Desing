import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InstructorEvaluation,
  InstructorEvaluationDocument,
} from './schemas/instructor-eval.schema';
import { CreateInstructorEvalDto } from './dto/create-instructor-eval.dto';
import { UpdateInstructorEvalDto } from './dto/update-instructor-eval.dto';
import { Ova, OvaDocument } from '../ovas/schemas/ova.schema';

const FASES_TOTALES = 5;

@Injectable()
export class InstructorEvaluationService {
  private readonly logger = new Logger(InstructorEvaluationService.name);

  constructor(
    @InjectModel(InstructorEvaluation.name)
    private readonly model: Model<InstructorEvaluationDocument>,
    @InjectModel(Ova.name) private readonly ovaModel: Model<OvaDocument>,
  ) {}

  async create(dto: CreateInstructorEvalDto) {
    const doc = await this.model.create(dto);
    await this.syncOvaState(dto.idOVA);
    return doc;
  }

  async findAll() {
    return this.model.find().exec();
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException(`Evaluación ${id} no encontrada`);
    return doc;
  }

  async findByOva(idOVA: string) {
    return this.model.find({ idOVA }).exec();
  }

  async findByOvaAndFase(idOVA: string, fase: string) {
    return this.model.findOne({ idOVA, fase }).exec();
  }

  async findByDocente(idDocente: string) {
    return this.model.find({ idDocente }).exec();
  }

  async update(id: string, dto: UpdateInstructorEvalDto) {
    const updated = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Evaluación ${id} no encontrada`);
    await this.syncOvaState(updated.idOVA);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Evaluación ${id} no encontrada`);
    await this.syncOvaState(deleted.idOVA);
    return { message: 'Evaluación eliminada' };
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  Sincroniza el state del OVA según las evaluaciones del docente.
  //
  //  Regla:
  //   - Si las 5 fases ADDIE están 'aprobado' → OVA pasa a 'revisado'
  //   - En cualquier otro caso                → OVA queda en 'en_progreso'
  //
  //  Se llama tras CADA cambio en una evaluación (create / update / delete).
  //  Es idempotente — si ya está en el estado correcto, no hace nada.
  // ─────────────────────────────────────────────────────────────────────────
  private async syncOvaState(idOVA: string) {
    try {
      const aprobadas = await this.model.countDocuments({
        idOVA,
        estado: 'aprobado',
      });

      const targetState = aprobadas >= FASES_TOTALES ? 'revisado' : 'en_progreso';

      const ova = await this.ovaModel.findById(idOVA).exec();
      if (!ova) return;

      if (ova.state !== targetState) {
        ova.state = targetState;
        await ova.save();
        this.logger.log(
          `OVA ${idOVA} → state="${targetState}" (${aprobadas}/${FASES_TOTALES} fases aprobadas)`,
        );
      }
    } catch (err) {
      this.logger.warn(
        `No se pudo sincronizar state del OVA ${idOVA}: ${(err as Error).message}`,
      );
    }
  }
}
