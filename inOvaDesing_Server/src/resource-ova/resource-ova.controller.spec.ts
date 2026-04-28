import { Test, TestingModule } from '@nestjs/testing';
import { LearningResourceController } from './resource-ova.controller';
import { LearningResourceService } from './resource-ova.service';

describe('LearningResourceController', () => {
  let controller: LearningResourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearningResourceController],
      providers: [LearningResourceService],
    }).compile();

    controller = module.get<LearningResourceController>(LearningResourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
