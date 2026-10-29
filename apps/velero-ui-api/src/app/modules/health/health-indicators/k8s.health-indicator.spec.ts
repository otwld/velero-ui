import { Test, TestingModule } from '@nestjs/testing';
import { Health } from '@kubernetes/client-node';
import { firstValueFrom } from 'rxjs';
import { K8S_CONNECTION } from '@velero-ui-api/shared/utils/k8s.utils';
import { K8sHealthIndicator } from './k8s.health-indicator';

jest.mock('@kubernetes/client-node', () => ({ Health: jest.fn() }));

describe('K8sHealthIndicator', () => {
  let module: TestingModule;
  let service: K8sHealthIndicator;
  const connection = {};
  const readyz = jest.fn();

  beforeEach(async () => {
    readyz.mockReset();
    jest.mocked(Health).mockReset();
    jest
      .mocked(Health)
      .mockImplementation(() => ({ readyz }) as unknown as Health);
    module = await Test.createTestingModule({
      providers: [
        K8sHealthIndicator,
        { provide: K8S_CONNECTION, useValue: connection },
      ],
    }).compile();

    service = module.get<K8sHealthIndicator>(K8sHealthIndicator);
  });

  afterEach(async () => {
    await module.close();
  });

  it.each([
    [true, 'up'],
    [false, 'down'],
  ])('reports readiness %s as %s', async (ready, status) => {
    readyz.mockResolvedValueOnce(ready);

    await expect(firstValueFrom(service.isHealthy())).resolves.toEqual({
      k8s: { status },
    });
    expect(Health).toHaveBeenCalledWith(connection);
    expect(readyz).toHaveBeenCalledTimes(1);
  });

  it('propagates a failed readiness request', async () => {
    const error = new Error('Kubernetes API unavailable');
    readyz.mockRejectedValueOnce(error);

    await expect(firstValueFrom(service.isHealthy())).rejects.toBe(error);
  });
});
