import { Test, TestingModule } from '@nestjs/testing';
import { StorageLocationService } from './storage-location.service';

describe('StorageLocationService', () => {
  let service: StorageLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageLocationService],
    }).compile();

    service = module.get<StorageLocationService>(StorageLocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
