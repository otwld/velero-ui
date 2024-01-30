import { Test, TestingModule } from '@nestjs/testing';
import { RestoreController } from './restore.controller';

describe('RestoreController', () => {
  let controller: RestoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestoreController],
    }).compile();

    controller = module.get<RestoreController>(RestoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
