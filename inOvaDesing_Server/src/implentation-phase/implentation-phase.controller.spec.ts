import { Test, TestingModule } from '@nestjs/testing';
import { ImplentationPhaseController } from './implentation-phase.controller';
import { ImplementationPhaseService } from './implentation-phase.service';

describe('ImplentationPhaseController', () => {
  let controller: ImplentationPhaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImplentationPhaseController],
      providers: [ImplementationPhaseService],
    }).compile();

    controller = module.get<ImplentationPhaseController>(ImplentationPhaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
