import { Test, TestingModule } from '@nestjs/testing';
import { StorageLocationController } from './storage-location.controller';

describe('StorageLocationController', () => {
  let controller: StorageLocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageLocationController],
    }).compile();

    controller = module.get<StorageLocationController>(
      StorageLocationController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
