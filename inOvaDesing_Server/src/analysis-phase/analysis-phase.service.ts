import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnalysisPhase, AnalysisPhaseDocument } from './schemas/analysis.schema';
import { CreateAnalysisPhaseDto } from './dto/create-analysis-phase.dto';
import { UpdateAnalysisPhaseDto } from './dto/update-analysis-phase.dto';

@Injectable()
export class AnalysisPhaseService {
  constructor(
    @InjectModel(AnalysisPhase.name) private model: Model<AnalysisPhaseDocument>,
  ) {}

  async create(dto: CreateAnalysisPhaseDto) {
    return this.model.create(dto);
  }

  async findAll() {
    return this.model.find().exec();
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException(`AnalysisPhase ${id} no encontrada`);
    return doc;
  }

  async findByOva(idOVA: string) {
    return this.model.findOne({ idOVA }).exec();
  }

  async update(id: string, dto: UpdateAnalysisPhaseDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`AnalysisPhase ${id} no encontrada`);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`AnalysisPhase ${id} no encontrada`);
    return { message: 'Fase de análisis eliminada' };
  }
}
