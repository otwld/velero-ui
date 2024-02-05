import { Test, TestingModule } from '@nestjs/testing';
import { SnapshotLocationService } from './snapshot-location.service';

describe('SnapshotLocationService', () => {
  let service: SnapshotLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SnapshotLocationService],
    }).compile();

    service = module.get<SnapshotLocationService>(SnapshotLocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
