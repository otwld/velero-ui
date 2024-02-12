import { Test, TestingModule } from '@nestjs/testing';
import { K8sCustomObjectService } from 'apps/velero-ui-api/src/app/shared/modules/k8s-custom-object/k8s-custom-object.service';

describe('K8sCustomObjectService', () => {
  let service: K8sCustomObjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [K8sCustomObjectService],
    }).compile();

    service = module.get<K8sCustomObjectService>(K8sCustomObjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
