import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ova, OvaDocument } from './schemas/ova.schema';
import { CreateOvaDto } from './dto/create-ova.dto';
import { UpdateOvaDto } from './dto/update-ova.dto';

@Injectable()
export class OvasService {
  constructor(
    @InjectModel(Ova.name) private readonly model: Model<OvaDocument>,
  ) {}

  // ── CREATE ────────────────────────────────────────────────────────────────
  async create(dto: CreateOvaDto) {
    return this.model.create(dto);
  }

  // ── FIND ALL ──────────────────────────────────────────────────────────────
  async findAll() {
    return this.model.find().exec();
  }

  // ── FIND ONE ──────────────────────────────────────────────────────────────
  async findOne(id: string) {
    const ova = await this.model.findById(id).exec();
    if (!ova) throw new NotFoundException(`OVA ${id} no encontrado`);
    return ova;
  }

  // ── OVAs DE UN ESTUDIANTE (CU-3, CU-9) ───────────────────────────────────
  async findByStudent(idEstudiante: string) {
    return this.model.find({ idEstudiante }).exec();
  }

  // ── OVAs DE LOS ESTUDIANTES DE UN DOCENTE (dashboard docente) ────────────
  // Recibe la lista de IDs de estudiantes del docente y devuelve sus OVAs
  async findByStudentIds(studentIds: string[]) {
    return this.model.find({ idEstudiante: { $in: studentIds } }).exec();
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────
  async update(id: string, dto: UpdateOvaDto) {
    const updated = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`OVA ${id} no encontrado`);
    return updated;
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`OVA ${id} no encontrado`);
    return { message: `OVA ${id} eliminado correctamente` };
  }
}
