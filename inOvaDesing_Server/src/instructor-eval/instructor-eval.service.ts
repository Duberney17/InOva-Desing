import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InstructorEvaluation, InstructorEvaluationDocument } from './schemas/instructor-eval.schema';
import { CreateInstructorEvalDto } from './dto/create-instructor-eval.dto';
import { UpdateInstructorEvalDto } from './dto/update-instructor-eval.dto';

@Injectable()
export class InstructorEvaluationService {
  constructor(
    @InjectModel(InstructorEvaluation.name)
    private readonly model: Model<InstructorEvaluationDocument>,
  ) {}

  async create(dto: CreateInstructorEvalDto) {
    return this.model.create(dto);
  }

  async findAll() {
    return this.model.find().exec();
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException(`Evaluación ${id} no encontrada`);
    return doc;
  }

  // ── Evaluaciones de un OVA (todas las fases) ──────────────────────────────
  async findByOva(idOVA: string) {
    return this.model.find({ idOVA }).exec();
  }

  // ── Evaluación de una fase específica de un OVA ────────────────────────────
  async findByOvaAndFase(idOVA: string, fase: string) {
    return this.model.findOne({ idOVA, fase }).exec();
  }

  // ── Todas las evaluaciones hechas por un docente ───────────────────────────
  async findByDocente(idDocente: string) {
    return this.model.find({ idDocente }).exec();
  }

  async update(id: string, dto: UpdateInstructorEvalDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Evaluación ${id} no encontrada`);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Evaluación ${id} no encontrada`);
    return { message: 'Evaluación eliminada' };
  }
}
