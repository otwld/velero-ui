import { Test, TestingModule } from '@nestjs/testing';
import { SnapshotLocationController } from './snapshot-location.controller';

describe('SnapshotLocationController', () => {
  let controller: SnapshotLocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SnapshotLocationController],
    }).compile();

    controller = module.get<SnapshotLocationController>(
      SnapshotLocationController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
