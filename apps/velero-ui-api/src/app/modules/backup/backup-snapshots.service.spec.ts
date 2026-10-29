import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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
    await expect(lastValueFrom(result.get('daily'))).resolves.toEqual({
      items: [],
      issues: [],
    });
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
    await expect(lastValueFrom(result.get('daily'))).resolves.toMatchObject({
      items: [
        expect.objectContaining({
          type: 'Native',
          name: 'pv',
          snapshotID: 'id',
        }),
      ],
    });
    expect(downloads.create).toHaveBeenCalledTimes(4);
    expect(api.listClusterCustomObject).not.toHaveBeenCalled();
  });
  it('does not request absent snapshot archives for filesystem-only backups', async () => {
    const { result, downloads } = service({
      status: { phase: V1BackupPhase.Completed },
    });
    await expect(lastValueFrom(result.get('daily'))).resolves.toEqual({
      items: [],
      issues: [],
    });
    expect(downloads.create).not.toHaveBeenCalled();
  });
  it('does not hide archive retrieval errors', async () => {
    const { result, http } = service({
      status: { phase: V1BackupPhase.Completed, volumeSnapshotsAttempted: 1 },
    });
    http.get.mockReturnValue(
      throwError(() => new Error('storage unavailable'))
    );
    await expect(lastValueFrom(result.get('daily'))).resolves.toEqual({
      items: [],
      issues: [
        { source: 'volumeInfos', reason: 'error' },
        { source: 'native', reason: 'error' },
      ],
    });
  });
  it('handles clusters without CSI CRDs but preserves authorization errors', async () => {
    const { result, api } = service({
      metadata: { name: 'daily' },
      status: { phase: V1BackupPhase.InProgress },
    });
    api.listClusterCustomObject.mockRejectedValue({ code: 404 });
    await expect(lastValueFrom(result.get('daily'))).resolves.toEqual({
      items: [],
      issues: [{ source: 'csi', reason: 'unavailable' }],
    });
    api.listClusterCustomObject.mockRejectedValue({ code: 403 });
    await expect(lastValueFrom(result.get('daily'))).resolves.toEqual({
      items: [],
      issues: [{ source: 'csi', reason: 'error' }],
    });
  });
});

// 1.17 removed standalone CSI archives; current metadata must be sufficient.
it('reads modern CSI metadata without accessing obsolete archives', async () => {
  const { result, downloads, http } = service({
    status: { phase: V1BackupPhase.Completed, csiVolumeSnapshotsAttempted: 1 },
  });
  http.get.mockImplementation((kind) =>
    kind === V1DownloadTargetKind.BackupVolumeInfos
      ? of({
          data: gzipSync(
            JSON.stringify([
              {
                backupMethod: 'CSISnapshot',
                pvcName: 'data',
                pvcNamespace: 'app',
                pvName: 'pv',
                result: 'succeeded',
                csiSnapshotInfo: {
                  snapshotHandle: 'provider',
                  vscName: 'content',
                  driver: 'driver',
                  size: 1024,
                  ReadyToUse: true,
                },
              },
            ])
          ),
        })
      : throwError(() => ({ response: { status: 404 } }))
  );
  await expect(lastValueFrom(result.get('daily'))).resolves.toMatchObject({
    items: [
      {
        volume: 'data',
        namespace: 'app',
        phase: 'Completed',
        snapshotID: 'provider',
        size: 1024,
      },
    ],
    issues: [],
  });
  expect(downloads.create).toHaveBeenCalledTimes(1);
});

function archived(
  artifacts: Partial<Record<V1DownloadTargetKind, unknown>>,
  backup: object = {
    status: {
      phase: V1BackupPhase.Completed,
      volumeSnapshotsAttempted: 1,
      csiVolumeSnapshotsAttempted: 1,
    },
  }
) {
  const context = service(backup);
  context.http.get.mockImplementation((kind) => {
    const value = artifacts[kind];
    if (
      value instanceof Error ||
      (value && typeof value === 'object' && 'response' in value)
    )
      return throwError(() => value);
    if (value === undefined)
      return throwError(() => ({ response: { status: 404 } }));
    return of({ data: gzipSync(JSON.stringify(value)) });
  });
  return context;
}
const oldNative = [
  {
    spec: { persistentVolumeName: 'pv-native' },
    status: { phase: 'Completed', providerSnapshotID: 'provider-native' },
  },
];
const oldCSI = [
  {
    metadata: { name: 'snapshot', namespace: 'app' },
    spec: { source: { persistentVolumeClaimName: 'database' } },
    status: { boundVolumeSnapshotContentName: 'content', readyToUse: true },
  },
];
const oldContents = [
  {
    metadata: { name: 'content' },
    spec: {
      driver: 'csi.example',
      volumeSnapshotRef: { name: 'snapshot', namespace: 'app' },
    },
    status: {
      snapshotHandle: 'provider-csi',
      restoreSize: 4096,
      readyToUse: true,
    },
  },
];

describe('archived source isolation', () => {
  it.each([403, 500, 504])(
    'keeps native visible while CSI archive fails (%s)',
    async (status) => {
      const { result } = archived({
        [V1DownloadTargetKind.BackupVolumeSnapshots]: oldNative,
        [V1DownloadTargetKind.CSIBackupVolumeSnapshots]: {
          response: { status },
        },
        [V1DownloadTargetKind.CSIBackupVolumeSnapshotContents]: oldContents,
      });
      await expect(lastValueFrom(result.get('daily'))).resolves.toMatchObject({
        items: [{ type: 'Native' }],
        issues: [{ source: 'csi', reason: 'error' }],
      });
    }
  );
  it('keeps CSI visible while native source fails', async () => {
    const { result } = archived({
      [V1DownloadTargetKind.BackupVolumeSnapshots]: new Error('storage failed'),
      [V1DownloadTargetKind.CSIBackupVolumeSnapshots]: oldCSI,
      [V1DownloadTargetKind.CSIBackupVolumeSnapshotContents]: oldContents,
    });
    await expect(lastValueFrom(result.get('daily'))).resolves.toMatchObject({
      items: [{ type: 'CSI' }],
      issues: [{ source: 'native', reason: 'error' }],
    });
  });
  it('keeps a VolumeInfos permission failure visible while independent historical native data loads', async () => {
    const { result } = archived(
      {
        [V1DownloadTargetKind.BackupVolumeInfos]: { response: { status: 403 } },
        [V1DownloadTargetKind.BackupVolumeSnapshots]: oldNative,
      },
      {
        status: {
          phase: V1BackupPhase.Completed,
          volumeSnapshotsAttempted: 1,
          csiVolumeSnapshotsAttempted: 0,
        },
      }
    );
    await expect(lastValueFrom(result.get('daily'))).resolves.toMatchObject({
      items: [{ type: 'Native' }],
      issues: [{ source: 'volumeInfos', reason: 'error' }],
    });
  });
  it.each(['invalid gzip', 'invalid JSON', 'object', 'null item'])(
    'reports corrupt metadata (%s)',
    async (caseName) => {
      const { result, http, downloads } = service({
        status: {
          phase: V1BackupPhase.Completed,
          csiVolumeSnapshotsAttempted: 1,
        },
      });
      const body =
        caseName === 'invalid gzip'
          ? Buffer.from('bad')
          : gzipSync(
              caseName === 'invalid JSON'
                ? '['
                : caseName === 'object'
                  ? '{}'
                  : caseName === 'null'
                    ? 'null'
                    : '[null]'
            );
      http.get.mockReturnValue(of({ data: body }));
      const response = await lastValueFrom(result.get('daily'));
      expect(response.issues).toContainEqual({
        source: 'volumeInfos',
        reason: 'error',
      });
      expect(response.items).toEqual([]);
      expect(JSON.stringify(response)).not.toContain('downloadURL');
      expect(downloads.create).toHaveBeenCalled();
    }
  );
  it('distinguishes explicit missing key XML from generic forbidden and missing bucket', async () => {
    for (const [status, xml, reason] of [
      [403, 'NoSuchKey', 'unavailable'],
      [403, 'AccessDenied', 'error'],
      [404, 'NoSuchBucket', 'error'],
    ] as const) {
      const { result } = archived(
        {
          [V1DownloadTargetKind.CSIBackupVolumeSnapshots]: {
            response: {
              status,
              data: Buffer.from(`<Error><Code>${xml}</Code></Error>`),
            },
          },
        },
        {
          status: {
            phase: V1BackupPhase.Completed,
            volumeSnapshotsAttempted: 0,
            csiVolumeSnapshotsAttempted: 1,
          },
        }
      );
      expect((await lastValueFrom(result.get('daily'))).issues).toEqual([
        { source: 'csi', reason },
      ]);
    }
  });
  it('marks unexpectedly empty archives as incomplete', async () => {
    const { result } = archived({
      [V1DownloadTargetKind.BackupVolumeInfos]: [],
      [V1DownloadTargetKind.BackupVolumeSnapshots]: [],
      [V1DownloadTargetKind.CSIBackupVolumeSnapshots]: [],
      [V1DownloadTargetKind.CSIBackupVolumeSnapshotContents]: [],
    });
    expect((await lastValueFrom(result.get('daily'))).issues).toEqual([
      { source: 'native', reason: 'unavailable' },
      { source: 'csi', reason: 'unavailable' },
    ]);
  });
  it('preserves permission errors when reading Backup itself', async () => {
    const ctx = service({});
    (
      ctx.result as unknown as { objects: { getByName: jest.Mock } }
    ).objects.getByName.mockReturnValue(throwError(() => ({ code: 403 })));
    await expect(lastValueFrom(ctx.result.get('daily'))).rejects.toEqual({
      code: 403,
    });
  });
});

describe('Velero 1.13–1.18 stored contract matrix', () => {
  it.each(['1.13.0', '1.14.0', '1.15.0', '1.16.0', '1.17.0', '1.18.0'])(
    'normalizes producer %s, regardless of current server version',
    async (version) => {
      const infos = JSON.parse(
        readFileSync(
          join(__dirname, 'fixtures', `volume-infos-${version}.json`),
          'utf8'
        )
      );
      const old = version === '1.13.0' || version === '1.14.0';
      const { result, downloads } = archived(
        {
          [V1DownloadTargetKind.BackupVolumeInfos]: infos,
          ...(old
            ? {
                [V1DownloadTargetKind.BackupVolumeSnapshots]: oldNative,
                [V1DownloadTargetKind.CSIBackupVolumeSnapshots]: oldCSI,
                [V1DownloadTargetKind.CSIBackupVolumeSnapshotContents]:
                  oldContents,
              }
            : {}),
        },
        {
          spec: { snapshotMoveData: true },
          status: {
            phase: V1BackupPhase.Completed,
            volumeSnapshotsAttempted: 1,
            csiVolumeSnapshotsAttempted: 2,
          },
        }
      );
      const actual = await lastValueFrom(result.get('daily'));
      expect(actual.issues).toEqual([]);
      expect(actual.items).toHaveLength(3);
      expect(
        actual.items.find((item) => item.volume === 'database')
      ).toMatchObject({
        namespace: 'app',
        pvName: 'pv-database',
        snapshotID: 'provider-csi',
        driver: 'csi.example',
        size: 4096,
        phase: 'Completed',
      });
      expect(actual.items.find((item) => item.volume === 'disk')).toMatchObject(
        { type: 'Native', phase: 'Completed', snapshotID: 'provider-native' }
      );
      const moved = actual.items.find((item) => item.volume === 'moved');
      expect(moved.phase).toBe(old ? 'Unknown' : 'Completed');
      expect(moved.size).toBe(version === '1.13.0' ? undefined : 123);
      expect(moved.dataMoverSnapshotID).toBe(
        version === '1.13.0' ? undefined : 'repository-id'
      );
      expect(downloads.create).toHaveBeenCalledTimes(old ? 4 : 1);
    }
  );
  it('preserves incomplete 1.13 moved metadata without requesting nonexistent local CSI archives', async () => {
    const infos = JSON.parse(
      readFileSync(
        join(__dirname, 'fixtures', 'volume-infos-1.13.0.json'),
        'utf8'
      )
    ).filter((info: { snapshotDataMoved?: boolean }) => info.snapshotDataMoved);
    const { result, downloads } = archived(
      { [V1DownloadTargetKind.BackupVolumeInfos]: infos },
      {
        spec: { snapshotMoveData: true },
        status: {
          phase: V1BackupPhase.Completed,
          csiVolumeSnapshotsAttempted: 1,
        },
      }
    );
    expect((await lastValueFrom(result.get('daily'))).items[0]).toMatchObject({
      phase: 'Unknown',
      snapshotDataMoved: true,
    });
    expect(downloads.create).toHaveBeenCalledTimes(1);
  });
  it('consults available metadata when snapshot specification exists but counters are absent', async () => {
    const { result, downloads } = archived(
      { [V1DownloadTargetKind.BackupVolumeInfos]: [] },
      {
        spec: { snapshotVolumes: true },
        status: { phase: V1BackupPhase.Completed },
      }
    );
    expect(await lastValueFrom(result.get('daily'))).toEqual({
      items: [],
      issues: [],
    });
    expect(downloads.create).toHaveBeenCalledTimes(1);
  });
  it('reads legacy archives when VolumeInfos is absent after import on a newer server', async () => {
    const { result } = archived({
      [V1DownloadTargetKind.BackupVolumeSnapshots]: oldNative,
      [V1DownloadTargetKind.CSIBackupVolumeSnapshots]: oldCSI,
      [V1DownloadTargetKind.CSIBackupVolumeSnapshotContents]: oldContents,
    });
    expect(await lastValueFrom(result.get('daily'))).toMatchObject({
      items: [{ type: 'Native' }, { type: 'CSI' }],
      issues: [],
    });
  });
});

describe('live snapshot transitions and identity', () => {
  it('does not read optional live CSI resources when snapshots were disabled', async () => {
    const { result, api } = service({
      spec: { snapshotVolumes: false },
      status: { phase: V1BackupPhase.InProgress },
    });
    expect(await lastValueFrom(result.get('daily'))).toEqual({
      items: [],
      issues: [],
    });
    expect(api.listClusterCustomObject).not.toHaveBeenCalled();
  });
  it('keeps live CSI volumes when backup completes and switches to metadata', async () => {
    const { result, api, http } = service({
      metadata: { name: 'daily', uid: 'uid' },
      status: { phase: V1BackupPhase.InProgress },
    });
    api.listClusterCustomObject.mockImplementation(({ plural }) =>
      Promise.resolve({
        items: plural === 'volumesnapshots' ? oldCSI : oldContents,
      })
    );
    expect((await lastValueFrom(result.get('daily'))).items).toHaveLength(1);
    (
      result as unknown as { objects: { getByName: jest.Mock } }
    ).objects.getByName.mockReturnValue(
      of({
        status: {
          phase: V1BackupPhase.Completed,
          csiVolumeSnapshotsAttempted: 1,
        },
      })
    );
    http.get.mockImplementation((kind) =>
      of({
        data: gzipSync(
          JSON.stringify(
            kind === V1DownloadTargetKind.BackupVolumeInfos
              ? [
                  {
                    backupMethod: 'CSISnapshot',
                    pvcName: 'database',
                    pvcNamespace: 'app',
                    result: 'succeeded',
                    csiSnapshotInfo: {
                      snapshotHandle: 'provider-csi',
                      vscName: 'content',
                      size: 4096,
                    },
                  },
                ]
              : []
          )
        ),
      })
    );
    expect((await lastValueFrom(result.get('daily'))).items).toHaveLength(1);
  });
  it('hashes long backup labels and excludes reused names from another backup UID', async () => {
    const { result, api } = service({
      metadata: { name: 'x'.repeat(70), uid: 'current' },
      status: { phase: V1BackupPhase.InProgress },
    });
    api.listClusterCustomObject.mockImplementation(({ plural }) =>
      Promise.resolve({
        items:
          plural === 'volumesnapshots'
            ? [
                {
                  ...oldCSI[0],
                  metadata: {
                    ...oldCSI[0].metadata,
                    labels: { 'velero.io/backup-uid': 'other' },
                  },
                },
                {
                  metadata: {
                    name: 'unbound',
                    labels: { 'velero.io/backup-uid': 'current' },
                  },
                },
              ]
            : [
                {
                  ...oldContents[0],
                  metadata: {
                    name: 'content',
                    labels: { 'velero.io/backup-uid': 'other' },
                  },
                },
              ],
      })
    );
    const actual = await lastValueFrom(result.get('daily'));
    expect(actual.items).toHaveLength(1);
    expect(actual.items[0].name).toBe('unbound');
    expect(api.listClusterCustomObject.mock.calls[0][0].labelSelector).toMatch(
      /^velero.io\/backup-name=x{57}[a-f0-9]{6}$/
    );
  });
  it('falls back for explicitly requested snapshots with absent counters and artifact', async () => {
    const { result } = archived(
      {
        [V1DownloadTargetKind.BackupVolumeSnapshots]: oldNative,
        [V1DownloadTargetKind.CSIBackupVolumeSnapshots]: oldCSI,
        [V1DownloadTargetKind.CSIBackupVolumeSnapshotContents]: oldContents,
      },
      {
        spec: { snapshotVolumes: true },
        status: { phase: V1BackupPhase.Completed },
      }
    );
    expect((await lastValueFrom(result.get('daily'))).items).toHaveLength(2);
  });
  it('does not fetch CSI archives for a native-only backup imported without VolumeInfos', async () => {
    const { result, downloads } = archived(
      { [V1DownloadTargetKind.BackupVolumeSnapshots]: oldNative },
      {
        status: { phase: V1BackupPhase.Completed, volumeSnapshotsAttempted: 1 },
      }
    );
    expect((await lastValueFrom(result.get('daily'))).issues).toEqual([]);
    expect(downloads.create).toHaveBeenCalledTimes(2);
  });
});

it('accepts Go nil slices as empty legacy archives while reporting expected missing snapshots', async () => {
  const { result } = archived({
    [V1DownloadTargetKind.BackupVolumeInfos]: null,
    [V1DownloadTargetKind.BackupVolumeSnapshots]: null,
    [V1DownloadTargetKind.CSIBackupVolumeSnapshots]: null,
    [V1DownloadTargetKind.CSIBackupVolumeSnapshotContents]: null,
  });
  expect(await lastValueFrom(result.get('daily'))).toEqual({
    items: [],
    issues: [
      { source: 'native', reason: 'unavailable' },
      { source: 'csi', reason: 'unavailable' },
    ],
  });
});
