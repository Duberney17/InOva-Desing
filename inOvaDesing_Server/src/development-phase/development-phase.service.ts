import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DevelopmentPhase, DevelopmentPhaseDocument } from './schemas/development-phase.schema';
import { CreateDevelopmentPhaseDto } from './dto/create-development-phase.dto';
import { UpdateDevelopmentPhaseDto } from './dto/update-development-phase.dto';

@Injectable()
export class DevelopmentPhaseService {
  constructor(
    @InjectModel(DevelopmentPhase.name) private model: Model<DevelopmentPhaseDocument>,
  ) {}

  async create(dto: CreateDevelopmentPhaseDto) {
    return this.model.create(dto);
  }

  async findAll() {
    return this.model.find().exec();
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException(`DevelopmentPhase ${id} no encontrada`);
    return doc;
  }

  async findByOva(idOVA: string) {
    return this.model.findOne({ idOVA }).exec();
  }

  async update(id: string, dto: UpdateDevelopmentPhaseDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`DevelopmentPhase ${id} no encontrada`);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`DevelopmentPhase ${id} no encontrada`);
    return { message: 'Fase de desarrollo eliminada' };
  }
}
