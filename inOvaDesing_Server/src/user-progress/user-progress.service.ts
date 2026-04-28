import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserProgress, UserProgressDocument } from './schemas/user-progress.schema';
import { CreateUserProgressDto } from './dto/create-user-progress.dto';
import { UpdateUserProgressDto } from './dto/update-user-progress.dto';

const TOTAL_FASES = 5;

@Injectable()
export class UserProgressService {
  constructor(
    @InjectModel(UserProgress.name)
    private readonly model: Model<UserProgressDocument>,
  ) {}

  // ── CREATE ────────────────────────────────────────────────────────────────
  async create(dto: CreateUserProgressDto) {
    const fasesCompletadas = dto.fasesCompletadas ?? [];
    const porcentaje = Math.round((fasesCompletadas.length / TOTAL_FASES) * 100);
    return this.model.create({ ...dto, fasesCompletadas, porcentaje });
  }

  // ── FIND ALL ──────────────────────────────────────────────────────────────
  async findAll() {
    return this.model.find().exec();
  }

  // ── FIND ONE ──────────────────────────────────────────────────────────────
  async findOne(id: string) {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException(`Progreso ${id} no encontrado`);
    return doc;
  }

  // ── Progreso de un estudiante en un OVA específico (CU-8) ─────────────────
  async findByOvaAndStudent(idOVA: string, idEstudiante: string) {
    return this.model.findOne({ idOVA, idEstudiante }).exec();
  }

  // ── Guardar avance: agregar una fase completada (CU-7) ─────────────────────
  async completarFase(idOVA: string, idEstudiante: string, fase: string) {
    let progress = await this.model.findOne({ idOVA, idEstudiante }).exec();

    if (!progress) {
      progress = await this.model.create({ idOVA, idEstudiante, fasesCompletadas: [], porcentaje: 0 });
    }

    if (!progress.fasesCompletadas.includes(fase)) {
      progress.fasesCompletadas.push(fase);
    }

    progress.faseActual = fase;
    progress.porcentaje = Math.round((progress.fasesCompletadas.length / TOTAL_FASES) * 100);
    return progress.save();
  }

  // ── Reiniciar progreso desde cero (CU-10) ─────────────────────────────────
  async resetProgress(idOVA: string, idEstudiante: string) {
    const progress = await this.model.findOne({ idOVA, idEstudiante }).exec();
    if (!progress) throw new NotFoundException('Progreso no encontrado para este OVA y estudiante');

    progress.fasesCompletadas = [];
    progress.faseActual = 'analisis';
    progress.porcentaje = 0;
    return progress.save();
  }

  // ── UPDATE genérico ────────────────────────────────────────────────────────
  async update(id: string, dto: UpdateUserProgressDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Progreso ${id} no encontrado`);
    return updated;
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Progreso ${id} no encontrado`);
    return { message: 'Progreso eliminado' };
  }
}
