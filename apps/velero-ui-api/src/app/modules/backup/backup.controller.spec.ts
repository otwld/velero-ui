import { Test, TestingModule } from '@nestjs/testing';
import { BackupController } from './backup.controller';

describe('BackupController', () => {
  let controller: BackupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BackupController],
    }).compile();

    controller = module.get<BackupController>(BackupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
