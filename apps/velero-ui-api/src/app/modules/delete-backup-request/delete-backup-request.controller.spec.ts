import { Test, TestingModule } from '@nestjs/testing';
import { DeleteBackupRequestController } from './delete-backup-request.controller';

describe('DeleteBackupRequestController', () => {
  let controller: DeleteBackupRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteBackupRequestController],
    }).compile();

    controller = module.get<DeleteBackupRequestController>(
      DeleteBackupRequestController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
