import { Test, TestingModule } from '@nestjs/testing';
import { VeleroService } from './velero.service';

describe('VeleroService', () => {
  let service: VeleroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VeleroService],
    }).compile();

    service = module.get<VeleroService>(VeleroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
