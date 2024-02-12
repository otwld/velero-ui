import { Test, TestingModule } from '@nestjs/testing';
import { VeleroHealthIndicator } from 'apps/velero-ui-api/src/app/modules/health/health-indicators/velero.health-indicator';

describe('VeleroService', () => {
  let service: VeleroHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VeleroHealthIndicator],
    }).compile();

    service = module.get<VeleroHealthIndicator>(VeleroHealthIndicator);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
