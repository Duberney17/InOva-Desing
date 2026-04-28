import { Test, TestingModule } from '@nestjs/testing';
import { SCOService } from './sco.service';

describe('SCOService', () => {
  let service: SCOService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SCOService],
    }).compile();

    service = module.get<SCOService>(SCOService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
