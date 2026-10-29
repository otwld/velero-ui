import { ConfigService } from '@nestjs/config';
import { KubeConfig } from '@kubernetes/client-node';
import { lastValueFrom, of } from 'rxjs';
import { V1DownloadTargetKind } from '@velero-ui/velero';
import { DownloadRequestService } from './download-request.service';
import { K8sCustomObjectService } from '../k8s-custom-object/k8s-custom-object.service';

jest.mock('@kubernetes/client-node', () => ({
  CustomObjectsApi: class {},
  KubeConfig: class {},
  Watch: class {},
}));
jest.mock('@velero-ui-api/shared/utils/k8s.utils', () => ({
  K8S_CONNECTION: 'connection',
}));
jest.mock('@velero-ui-api/shared/modules/velero/velero.constants', () => ({
  VELERO: { GROUP: 'velero.io', VERSION: 'v1' },
}));
jest.mock(
  '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.utils',
  () => ({ createK8sCustomObject: () => ({ metadata: { name: 'request' } }) })
);
jest.mock(
  '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service',
  () => ({ K8sCustomObjectService: class {} })
);

describe('download request error classification', () => {
  afterEach(() => jest.useRealTimers());
  it.each([403, 404, 500])(
    'preserves real Kubernetes failure %s after polling retries',
    async (code) => {
      jest.useFakeTimers();
      const error = { code };
      const api = {
        getNamespacedCustomObject: jest.fn().mockRejectedValue(error),
      };
      const service = new DownloadRequestService(
        { makeApiClient: () => api } as unknown as KubeConfig,
        {
          create: () => of({ metadata: { name: 'request' } }),
        } as unknown as K8sCustomObjectService,
        new ConfigService({ velero: { namespace: 'velero' } })
      );
      const assertion = expect(
        lastValueFrom(
          service.create({
            name: 'daily',
            kind: V1DownloadTargetKind.BackupVolumeInfos,
          })
        )
      ).rejects.toBe(error);
      await jest.advanceTimersByTimeAsync(20000);
      await assertion;
    }
  );
});

it('returns processed requests and polls requests that are not ready', async () => {
  jest.useFakeTimers();
  try {
    const processed = {
      status: {
        phase: 'Processed',
        downloadURL: 'https://storage.invalid/backup',
      },
    };
    const api = {
      getNamespacedCustomObject: jest
        .fn()
        .mockResolvedValueOnce({ status: { phase: 'New' } })
        .mockResolvedValue(processed),
    };
    const service = new DownloadRequestService(
      { makeApiClient: () => api } as unknown as KubeConfig,
      {
        create: () => of({ metadata: { name: 'request' } }),
      } as unknown as K8sCustomObjectService,
      new ConfigService({ velero: { namespace: 'velero' } })
    );
    const pending = lastValueFrom(
      service.create({
        name: 'daily',
        kind: V1DownloadTargetKind.BackupVolumeInfos,
      })
    );
    await jest.advanceTimersByTimeAsync(4000);
    await expect(pending).resolves.toEqual(processed);
    expect(api.getNamespacedCustomObject).toHaveBeenCalledTimes(2);
  } finally {
    jest.useRealTimers();
  }
});
