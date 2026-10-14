import { KubeConfig } from '@kubernetes/client-node';
import { of, lastValueFrom, throwError } from 'rxjs';
import { gzipSync } from 'node:zlib';
import { V1BackupPhase, V1DownloadTargetKind } from '@velero-ui/velero';
import { BackupSnapshotsService } from './backup-snapshots.service';
import { K8sCustomObjectService } from '../k8s-custom-object/k8s-custom-object.service';
import { DownloadRequestService } from '../download-request/download-request.service';
import { HttpService } from '@nestjs/axios';

jest.mock('../download-request/download-request.service', () => ({
  DownloadRequestService: class {},
}));
jest.mock('@kubernetes/client-node', () => ({
  CustomObjectsApi: class {},
  KubeConfig: class {},
  Watch: class {},
}));

function service(backup: object) {
  const api = {
    listClusterCustomObject: jest.fn().mockResolvedValue({ items: [] }),
  };
  const objects = { getByName: jest.fn().mockReturnValue(of(backup)) };
  const downloads = {
    create: jest
      .fn()
      .mockImplementation(({ kind }) => of({ status: { downloadURL: kind } })),
  };
  const http = { get: jest.fn().mockReturnValue(of({ data: gzipSync('[]') })) };
  const result = new BackupSnapshotsService(
    { makeApiClient: () => api } as unknown as KubeConfig,
    objects as unknown as K8sCustomObjectService,
    downloads as unknown as DownloadRequestService,
    http as unknown as HttpService
  );
  return { result, api, downloads, http };
}

describe('backup snapshot sources', () => {
  it('reads live CSI objects with backup labels while operations run', async () => {
    const { result, api, downloads } = service({
      metadata: { name: 'daily', uid: 'uid' },
      status: { phase: V1BackupPhase.WaitingForPluginOperations },
    });
    await expect(lastValueFrom(result.get('daily'))).resolves.toEqual([]);
    expect(api.listClusterCustomObject).toHaveBeenCalledWith(
      expect.objectContaining({
        group: 'snapshot.storage.k8s.io',
        version: 'v1',
        labelSelector: 'velero.io/backup-name=daily',
        plural: 'volumesnapshots',
      })
    );
    expect(downloads.create).not.toHaveBeenCalled();
  });
  it('reads archived compressed metadata after temporary objects disappear', async () => {
    const { result, api, downloads, http } = service({
      metadata: { name: 'daily' },
      status: {
        phase: V1BackupPhase.Completed,
        volumeSnapshotsAttempted: 1,
        csiVolumeSnapshotsAttempted: 1,
      },
    });
    http.get.mockImplementation((url) =>
      of({
        data: gzipSync(
          JSON.stringify(
            url === V1DownloadTargetKind.BackupVolumeSnapshots
              ? [
                  {
                    spec: { persistentVolumeName: 'pv' },
                    status: { phase: 'Completed', providerSnapshotID: 'id' },
                  },
                ]
              : []
          )
        ),
      })
    );
    await expect(lastValueFrom(result.get('daily'))).resolves.toEqual([
      expect.objectContaining({ type: 'Native', name: 'pv', snapshotID: 'id' }),
    ]);
    expect(downloads.create).toHaveBeenCalledTimes(3);
    expect(api.listClusterCustomObject).not.toHaveBeenCalled();
  });
  it('does not request absent snapshot archives for filesystem-only backups', async () => {
    const { result, downloads } = service({
      status: { phase: V1BackupPhase.Completed },
    });
    await expect(lastValueFrom(result.get('daily'))).resolves.toEqual([]);
    expect(downloads.create).not.toHaveBeenCalled();
  });
  it('does not hide archive retrieval errors', async () => {
    const { result, http } = service({
      status: { phase: V1BackupPhase.Completed, volumeSnapshotsAttempted: 1 },
    });
    http.get.mockReturnValue(
      throwError(() => new Error('storage unavailable'))
    );
    await expect(lastValueFrom(result.get('daily'))).rejects.toThrow(
      'storage unavailable'
    );
  });
  it('handles clusters without CSI CRDs but preserves authorization errors', async () => {
    const { result, api } = service({
      metadata: { name: 'daily' },
      status: { phase: V1BackupPhase.InProgress },
    });
    api.listClusterCustomObject.mockRejectedValue({ code: 404 });
    await expect(lastValueFrom(result.get('daily'))).resolves.toEqual([]);
    api.listClusterCustomObject.mockRejectedValue({ code: 403 });
    await expect(lastValueFrom(result.get('daily'))).rejects.toEqual({
      code: 403,
    });
  });
});
