import { Test, TestingModule } from '@nestjs/testing';
import { DeleteBackupRequestService } from './delete-backup-request.service';

describe('DeleteBackupRequestService', () => {
  let service: DeleteBackupRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteBackupRequestService],
    }).compile();

    service = module.get<DeleteBackupRequestService>(
      DeleteBackupRequestService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
