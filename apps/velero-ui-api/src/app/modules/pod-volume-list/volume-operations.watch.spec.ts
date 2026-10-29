import { ConfigService } from '@nestjs/config';
import { KubeConfig } from '@kubernetes/client-node';
import { K8sCustomObjectService } from '../k8s-custom-object/k8s-custom-object.service';
import { AppLogger } from '../../shared/modules/logger/logger.service';
const mockWatch = jest.fn().mockResolvedValue(new AbortController());
jest.mock('@kubernetes/client-node', () => ({
  CustomObjectsApi: class {},
  KubeConfig: class {},
  Watch: class {
    watch = mockWatch;
  },
}));
it('sends the parent selector to Kubernetes and retains it when reconnecting', async () => {
  jest.useFakeTimers();
  const service = new K8sCustomObjectService(
    { makeApiClient: () => ({}) } as unknown as KubeConfig,
    { debug: jest.fn(), error: jest.fn() } as unknown as AppLogger,
    new ConfigService({ velero: { namespace: 'velero' } })
  );
  const client = { id: 'detail', emit: jest.fn() };
  try {
    await service.watch(
      client,
      'datauploads',
      undefined,
      '100',
      'velero.io/backup-name=daily'
    );
    expect(mockWatch).toHaveBeenCalledWith(
      '/apis/velero.io/v2alpha1/namespaces/velero/datauploads',
      {
        fieldSelector: undefined,
        resourceVersion: '100',
        labelSelector: 'velero.io/backup-name=daily',
      },
      expect.any(Function),
      expect.any(Function)
    );
    mockWatch.mock.calls[0][2]('MODIFIED', {
      metadata: { resourceVersion: '101' },
    });
    mockWatch.mock.calls[0][3]();
    await jest.advanceTimersByTimeAsync(1000);
    expect(mockWatch.mock.calls[1][1]).toEqual({
      fieldSelector: undefined,
      resourceVersion: '101',
      labelSelector: 'velero.io/backup-name=daily',
    });
  } finally {
    service.unWatchAll(client);
    jest.useRealTimers();
  }
});
