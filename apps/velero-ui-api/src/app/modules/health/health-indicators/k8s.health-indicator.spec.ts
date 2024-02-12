import { Test, TestingModule } from '@nestjs/testing';
import { K8sHealthIndicator } from 'apps/velero-ui-api/src/app/modules/health/health-indicators/k8s.health-indicator';

describe('K8sHealthIndicator', () => {
  let service: K8sHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [K8sHealthIndicator],
    }).compile();

    service = module.get<K8sHealthIndicator>(K8sHealthIndicator);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
