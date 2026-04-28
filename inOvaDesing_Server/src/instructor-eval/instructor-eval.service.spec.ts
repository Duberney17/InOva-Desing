import { Test, TestingModule } from '@nestjs/testing';
import { InstructorEvaluationService } from './instructor-eval.service';

describe('InstructorEvaluationService', () => {
  let service: InstructorEvaluationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstructorEvaluationService],
    }).compile();

    service = module.get<InstructorEvaluationService>(InstructorEvaluationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
