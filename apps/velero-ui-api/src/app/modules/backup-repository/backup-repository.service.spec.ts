import { Test, TestingModule } from '@nestjs/testing';
import { BackupRepositoryService } from './backup-repository.service';

describe('BackupRepositoryService', () => {
  let service: BackupRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BackupRepositoryService],
    }).compile();

    service = module.get<BackupRepositoryService>(BackupRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
