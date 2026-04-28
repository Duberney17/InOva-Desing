import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImplementationPhase, ImplementationPhaseDocument } from './schemas/implementation-phase.schema';
import { CreateImplentationPhaseDto } from './dto/create-implentation-phase.dto';
import { UpdateImplentationPhaseDto } from './dto/update-implentation-phase.dto';

@Injectable()
export class ImplementationPhaseService {
  constructor(
    @InjectModel(ImplementationPhase.name) private model: Model<ImplementationPhaseDocument>,
  ) {}

  async create(dto: CreateImplentationPhaseDto) {
    return this.model.create(dto);
  }

  async findAll() {
    return this.model.find().exec();
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException(`ImplementationPhase ${id} no encontrada`);
    return doc;
  }

  async findByOva(idOVA: string) {
    return this.model.findOne({ idOVA }).exec();
  }

  async update(id: string, dto: UpdateImplentationPhaseDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`ImplementationPhase ${id} no encontrada`);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`ImplementationPhase ${id} no encontrada`);
    return { message: 'Fase de implementación eliminada' };
  }
}
