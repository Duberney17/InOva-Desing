import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EvaluationPhase, EvaluationPhaseDocument } from './schemas/evaluation-phase.schema';
import { CreateEvaluationPhaseDto } from './dto/create-evaluation-phase.dto';
import { UpdateEvaluationPhaseDto } from './dto/update-evaluation-phase.dto';

@Injectable()
export class EvaluationPhaseService {
  constructor(
    @InjectModel(EvaluationPhase.name) private model: Model<EvaluationPhaseDocument>,
  ) {}

  async create(dto: CreateEvaluationPhaseDto) {
    return this.model.create(dto);
  }

  async findAll() {
    return this.model.find().exec();
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException(`EvaluationPhase ${id} no encontrada`);
    return doc;
  }

  async findByOva(idOVA: string) {
    return this.model.findOne({ idOVA }).exec();
  }

  async update(id: string, dto: UpdateEvaluationPhaseDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`EvaluationPhase ${id} no encontrada`);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`EvaluationPhase ${id} no encontrada`);
    return { message: 'Fase de evaluación eliminada' };
  }
}
