import { Test, TestingModule } from '@nestjs/testing';
import { RestoreService } from './restore.service';

describe('RestoreService', () => {
  let service: RestoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestoreService],
    }).compile();

    service = module.get<RestoreService>(RestoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
