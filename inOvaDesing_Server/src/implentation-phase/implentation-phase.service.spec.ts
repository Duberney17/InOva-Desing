import { Test, TestingModule } from '@nestjs/testing';
import { ImplementationPhaseService } from './implentation-phase.service';

describe('ImplementationPhaseService', () => {
  let service: ImplementationPhaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImplementationPhaseService],
    }).compile();

    service = module.get<ImplementationPhaseService>(ImplementationPhaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
