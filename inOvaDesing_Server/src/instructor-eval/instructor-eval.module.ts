import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstructorEvalController } from './instructor-eval.controller';
import { InstructorEvaluationService } from './instructor-eval.service';
import {
  InstructorEvaluation,
  InstructorEvaluationSchema,
} from './schemas/instructor-eval.schema';
import { Ova, OvaSchema } from '../ovas/schemas/ova.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InstructorEvaluation.name, schema: InstructorEvaluationSchema },
      // Necesitamos el modelo de Ova para sincronizar su state cuando se aprueban/rechazan fases
      { name: Ova.name, schema: OvaSchema },
    ]),
  ],
  controllers: [InstructorEvalController],
  providers: [InstructorEvaluationService],
  exports: [InstructorEvaluationService],
})
export class InstructorEvalModule {}
