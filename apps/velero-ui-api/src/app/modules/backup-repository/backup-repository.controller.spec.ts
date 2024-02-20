import { Test, TestingModule } from '@nestjs/testing';
import { BackupRepositoryController } from './backup-repository.controller';

describe('BackupRepositoryController', () => {
  let controller: BackupRepositoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BackupRepositoryController],
    }).compile();

    controller = module.get<BackupRepositoryController>(
      BackupRepositoryController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
