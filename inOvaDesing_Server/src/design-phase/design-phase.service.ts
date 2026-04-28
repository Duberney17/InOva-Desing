import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DesignPhase, DesignPhaseDocument } from './schemas/design-phase.schema';
import { CreateDesignPhaseDto } from './dto/create-design-phase.dto';
import { UpdateDesignPhaseDto } from './dto/update-design-phase.dto';

@Injectable()
export class DesignPhaseService {
  constructor(
    @InjectModel(DesignPhase.name) private model: Model<DesignPhaseDocument>,
  ) {}

  async create(dto: CreateDesignPhaseDto) {
    return this.model.create(dto);
  }

  async findAll() {
    return this.model.find().exec();
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException(`DesignPhase ${id} no encontrada`);
    return doc;
  }

  async findByOva(idOVA: string) {
    return this.model.findOne({ idOVA }).exec();
  }

  async update(id: string, dto: UpdateDesignPhaseDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`DesignPhase ${id} no encontrada`);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`DesignPhase ${id} no encontrada`);
    return { message: 'Fase de diseño eliminada' };
  }
}
