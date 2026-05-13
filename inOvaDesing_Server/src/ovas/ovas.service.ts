import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ova, OvaDocument } from './schemas/ova.schema';
import { CreateOvaDto } from './dto/create-ova.dto';
import { UpdateOvaDto } from './dto/update-ova.dto';

import { AnalysisPhase, AnalysisPhaseDocument } from '../analysis-phase/schemas/analysis.schema';
import { DesignPhase, DesignPhaseDocument } from '../design-phase/schemas/design-phase.schema';
import { DevelopmentPhase, DevelopmentPhaseDocument } from '../development-phase/schemas/development-phase.schema';
import { EvaluationPhase, EvaluationPhaseDocument } from '../evaluation-phase/schemas/evaluation-phase.schema';
import { ImplementationPhase, ImplementationPhaseDocument } from '../implentation-phase/schemas/implementation-phase.schema';
import { UserProgress, UserProgressDocument } from '../user-progress/schemas/user-progress.schema';
import { InstructorEvaluation, InstructorEvaluationDocument } from '../instructor-eval/schemas/instructor-eval.schema';
import { OvaFilesService } from '../ova-files/ova-files.service';

@Injectable()
export class OvasService {
  private readonly logger = new Logger(OvasService.name);

  constructor(
    @InjectModel(Ova.name) private readonly model: Model<OvaDocument>,
    @InjectModel(AnalysisPhase.name) private readonly analysisModel: Model<AnalysisPhaseDocument>,
    @InjectModel(DesignPhase.name) private readonly designModel: Model<DesignPhaseDocument>,
    @InjectModel(DevelopmentPhase.name) private readonly devModel: Model<DevelopmentPhaseDocument>,
    @InjectModel(EvaluationPhase.name) private readonly evalPhaseModel: Model<EvaluationPhaseDocument>,
    @InjectModel(ImplementationPhase.name) private readonly implModel: Model<ImplementationPhaseDocument>,
    @InjectModel(UserProgress.name) private readonly progressModel: Model<UserProgressDocument>,
    @InjectModel(InstructorEvaluation.name) private readonly instructorEvalModel: Model<InstructorEvaluationDocument>,
    private readonly ovaFilesService: OvaFilesService,
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

  // ── DELETE simple (legacy, NO borra dependencias) ─────────────────────────
  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`OVA ${id} no encontrado`);
    return { message: `OVA ${id} eliminado correctamente` };
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  CASCADE: eliminar OVA Y todo lo relacionado
  //  - Las 5 fases ADDIE (analysis, design, development, evaluation, implementation)
  //  - El progreso del usuario
  //  - Las evaluaciones del docente
  //  - Los archivos adjuntos (Supabase + Mongo)
  //  - Finalmente el OVA en sí
  // ─────────────────────────────────────────────────────────────────────────
  async removeCascade(id: string) {
    const ova = await this.model.findById(id).exec();
    if (!ova) throw new NotFoundException(`OVA ${id} no encontrado`);

    this.logger.log(`Cascade delete del OVA ${id} ("${ova.title}")`);

    const results = await Promise.allSettled([
      this.analysisModel.deleteMany({ idOVA: id }).exec(),
      this.designModel.deleteMany({ idOVA: id }).exec(),
      this.devModel.deleteMany({ idOVA: id }).exec(),
      this.evalPhaseModel.deleteMany({ idOVA: id }).exec(),
      this.implModel.deleteMany({ idOVA: id }).exec(),
      this.progressModel.deleteMany({ idOVA: id }).exec(),
      this.instructorEvalModel.deleteMany({ idOVA: id }).exec(),
      this.ovaFilesService.removeByOva(id),
    ]);

    results.forEach((r, idx) => {
      if (r.status === 'rejected') {
        this.logger.warn(`Cascade delete: una limpieza falló (idx=${idx}): ${String(r.reason)}`);
      }
    });

    await this.model.findByIdAndDelete(id).exec();

    return { message: `OVA ${id} y todos sus datos eliminados` };
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  CLEAR (reset profundo): vacía TODO el contenido del OVA pero mantiene
  //  el OVA en sí. Lo deja como recién creado.
  //  - 5 fases ADDIE
  //  - progreso
  //  - archivos
  //  - evaluaciones del docente (para que el state vuelva a "en_progreso")
  // ─────────────────────────────────────────────────────────────────────────
  async clearOva(id: string) {
    const ova = await this.model.findById(id).exec();
    if (!ova) throw new NotFoundException(`OVA ${id} no encontrado`);

    this.logger.log(`Clear OVA ${id} ("${ova.title}")`);

    await Promise.allSettled([
      this.analysisModel.deleteMany({ idOVA: id }).exec(),
      this.designModel.deleteMany({ idOVA: id }).exec(),
      this.devModel.deleteMany({ idOVA: id }).exec(),
      this.evalPhaseModel.deleteMany({ idOVA: id }).exec(),
      this.implModel.deleteMany({ idOVA: id }).exec(),
      this.progressModel.deleteMany({ idOVA: id }).exec(),
      this.instructorEvalModel.deleteMany({ idOVA: id }).exec(),
      this.ovaFilesService.removeByOva(id),
    ]);

    // Defensa en profundidad: el state debería bajar a 'en_progreso'
    // automáticamente vía syncOvaState al borrar las evals, pero como aquí
    // borramos directo el model (no via el service), lo seteamos a mano.
    ova.state = 'en_progreso';
    await ova.save();

    return { message: `OVA ${id} reiniciado desde cero` };
  }
}
