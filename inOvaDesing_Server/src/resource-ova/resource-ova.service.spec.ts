import { Test, TestingModule } from '@nestjs/testing';
import { LearningResourceService } from './resource-ova.service';

describe('LearningResourceService', () => {
  let service: LearningResourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LearningResourceService],
    }).compile();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
    service = module.get<LearningResourceService>(LearningResourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
