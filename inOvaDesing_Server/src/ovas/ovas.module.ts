import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OvasService } from './ovas.service';
import { OvasController } from './ovas.controller';
import { Ova, OvaSchema } from './schemas/ova.schema';

// Schemas de los recursos relacionados — necesarios para cascade delete y reset
import { AnalysisPhase, AnalysisPhaseSchema } from '../analysis-phase/schemas/analysis.schema';
import { DesignPhase, DesignPhaseSchema } from '../design-phase/schemas/design-phase.schema';
import { DevelopmentPhase, DevelopmentPhaseSchema } from '../development-phase/schemas/development-phase.schema';
import { EvaluationPhase, EvaluationPhaseSchema } from '../evaluation-phase/schemas/evaluation-phase.schema';
import { ImplementationPhase, ImplementationPhaseSchema } from '../implentation-phase/schemas/implementation-phase.schema';
import { UserProgress, UserProgressSchema } from '../user-progress/schemas/user-progress.schema';
import { InstructorEvaluation, InstructorEvaluationSchema } from '../instructor-eval/schemas/instructor-eval.schema';

// Module de archivos — para borrar adjuntos en Supabase
import { OvaFilesModule } from '../ova-files/ova-files.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ova.name, schema: OvaSchema },
      { name: AnalysisPhase.name, schema: AnalysisPhaseSchema },
      { name: DesignPhase.name, schema: DesignPhaseSchema },
      { name: DevelopmentPhase.name, schema: DevelopmentPhaseSchema },
      { name: EvaluationPhase.name, schema: EvaluationPhaseSchema },
      { name: ImplementationPhase.name, schema: ImplementationPhaseSchema },
      { name: UserProgress.name, schema: UserProgressSchema },
      { name: InstructorEvaluation.name, schema: InstructorEvaluationSchema },
    ]),
    OvaFilesModule,
  ],
  controllers: [OvasController],
  providers: [OvasService],
  exports: [OvasService],
})
export class OvasModule {}
