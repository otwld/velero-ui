import { Inject, Injectable } from '@nestjs/common';
import {
  CustomObjectsApi,
  KubeConfig,
  KubernetesListObject,
} from '@kubernetes/client-node';
import { HttpService } from '@nestjs/axios';
import { catchError, concatMap, forkJoin, map, Observable, of } from 'rxjs';
import { createHash } from 'node:crypto';
import { unzipSync } from 'node:zlib';
import {
  BackupCSISnapshot,
  BackupCSISnapshotContent,
  BackupNativeSnapshot,
  BackupSnapshot,
  BackupSnapshotIssue,
  BackupSnapshotsResult,
  BackupVolumeInfo,
  Resources,
  V1Backup,
  V1BackupPhase,
  V1DownloadTargetKind,
} from '@velero-ui/velero';
import { K8S_CONNECTION } from '../../shared/utils/k8s.utils';
import { K8sCustomObjectService } from '../k8s-custom-object/k8s-custom-object.service';
import { DownloadRequestService } from '../download-request/download-request.service';
import {
  csiSnapshots,
  nativeSnapshots,
  volumeInfoSnapshots,
  mergeSnapshots,
} from './backup-snapshots.utils';

@Injectable()
export class BackupSnapshotsService {
  private readonly api: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) k8s: KubeConfig,
    private readonly objects: K8sCustomObjectService,
    private readonly downloads: DownloadRequestService,
    private readonly http: HttpService
  ) {
    this.api = k8s.makeApiClient(CustomObjectsApi);
  }

  get(name: string): Observable<BackupSnapshotsResult> {
    return this.objects.getByName<V1Backup>(Resources.BACKUP.plural, name).pipe(
      concatMap((backup) => {
        const finished = [
          V1BackupPhase.Completed,
          V1BackupPhase.PartiallyFailed,
          V1BackupPhase.Failed,
        ].includes(backup.status?.phase);
        if (!finished) {
          if (backup.spec?.snapshotVolumes === false)
            return of({ items: [], issues: [] });
          return this.settle('csi', this.liveCSI(backup));
        }
        if (
          !backup.status?.volumeSnapshotsAttempted &&
          !backup.status?.csiVolumeSnapshotsAttempted &&
          !backup.spec?.snapshotMoveData &&
          backup.spec?.snapshotVolumes !== true
        ) {
          return of({ items: [], issues: [] });
        }
        return this.settle(
          'volumeInfos',
          this.metadata<BackupVolumeInfo>(
            name,
            V1DownloadTargetKind.BackupVolumeInfos
          ).pipe(map(volumeInfoSnapshots))
        ).pipe(
          concatMap((current) => {
            // Access, network and corruption errors must never masquerade as old formats.
            const currentError = current.issues.some(
              (issue) => issue.reason === 'error'
            );
            const needs = (type: BackupSnapshot['type'], expected?: number) => {
              const items = current.items.filter((item) => item.type === type);
              return (
                items.some(
                  (item) =>
                    !item.snapshotDataMoved &&
                    (item.phase === 'Unknown' || !item.snapshotID)
                ) ||
                expected > items.length ||
                (!items.length &&
                  !currentError &&
                  current.issues.length > 0 &&
                  expected === undefined &&
                  ((type === 'CSI' && backup.spec?.snapshotMoveData) ||
                    (backup.spec?.snapshotVolumes === true &&
                      !backup.status?.volumeSnapshotsAttempted &&
                      !backup.status?.csiVolumeSnapshotsAttempted)))
              );
            };
            const nativeNeeded = needs(
              'Native',
              backup.status?.volumeSnapshotsAttempted
            );
            const csiNeeded = needs(
              'CSI',
              backup.status?.csiVolumeSnapshotsAttempted
            );
            const native = nativeNeeded
              ? this.settle(
                  'native',
                  this.metadata<BackupNativeSnapshot>(
                    name,
                    V1DownloadTargetKind.BackupVolumeSnapshots
                  ).pipe(map(nativeSnapshots))
                )
              : of({ items: [], issues: [] });
            const csi = csiNeeded
              ? this.settle(
                  'csi',
                  forkJoin({
                    snapshots: this.metadata<BackupCSISnapshot>(
                      name,
                      V1DownloadTargetKind.CSIBackupVolumeSnapshots
                    ),
                    contents: this.metadata<BackupCSISnapshotContent>(
                      name,
                      V1DownloadTargetKind.CSIBackupVolumeSnapshotContents
                    ),
                  }).pipe(
                    map(({ snapshots, contents }) =>
                      csiSnapshots(snapshots, contents)
                    )
                  )
                )
              : of({ items: [], issues: [] });
            return forkJoin({ native, csi }).pipe(
              map(({ native, csi }) => ({
                items: mergeSnapshots(current.items, [
                  ...native.items,
                  ...csi.items,
                ]),
                // Successful legacy fallback resolves missing VolumeInfos, but source failures stay visible.
                issues: [
                  ...(currentError ? current.issues : []),
                  ...native.issues,
                  ...csi.issues,
                  ...(nativeNeeded &&
                  native.issues.length === 0 &&
                  mergeSnapshots(
                    current.items.filter((item) => item.type === 'Native'),
                    native.items
                  ).length < (backup.status?.volumeSnapshotsAttempted || 0)
                    ? [
                        {
                          source: 'native' as const,
                          reason: 'unavailable' as const,
                        },
                      ]
                    : []),
                  ...(csiNeeded &&
                  csi.issues.length === 0 &&
                  mergeSnapshots(
                    current.items.filter((item) => item.type === 'CSI'),
                    csi.items
                  ).length < (backup.status?.csiVolumeSnapshotsAttempted || 0)
                    ? [
                        {
                          source: 'csi' as const,
                          reason: 'unavailable' as const,
                        },
                      ]
                    : []),
                ],
              }))
            );
          })
        );
      })
    );
  }

  private settle(
    source: BackupSnapshotIssue['source'],
    request: Observable<BackupSnapshot[]>
  ): Observable<BackupSnapshotsResult> {
    return request.pipe(
      map((items) => ({ items, issues: [] })),
      catchError((error) =>
        of({
          items: [],
          issues: [
            {
              source,
              reason: this.isUnavailable(error)
                ? ('unavailable' as const)
                : ('error' as const),
            },
          ],
        })
      )
    );
  }

  private isUnavailable(error: {
    code?: number;
    response?: { status?: number; data?: unknown };
  }): boolean {
    // Classify only explicit 404 responses. Generic S3 403 also means denied access.
    const status = error?.response?.status ?? error?.code;
    const data = error?.response?.data;
    const body = Buffer.isBuffer(data)
      ? data.toString()
      : typeof data === 'string'
        ? data
        : '';
    if (/<Code>NoSuchBucket<\/Code>/.test(body)) return false;
    return (
      status === 404 || (status === 403 && /<Code>NoSuchKey<\/Code>/.test(body))
    );
  }

  private liveCSI(backup: V1Backup): Observable<BackupSnapshot[]> {
    const options = {
      group: 'snapshot.storage.k8s.io',
      version: 'v1',
      labelSelector: `velero.io/backup-name=${backup.metadata.name.length <= 63 ? backup.metadata.name : backup.metadata.name.slice(0, 57) + createHash('sha256').update(backup.metadata.name).digest('hex').slice(0, 6)}`,
    };
    return forkJoin({
      snapshots: this.api.listClusterCustomObject({
        ...options,
        plural: 'volumesnapshots',
      }) as Promise<KubernetesListObject<BackupCSISnapshot>>,
      contents: this.api.listClusterCustomObject({
        ...options,
        plural: 'volumesnapshotcontents',
      }) as Promise<KubernetesListObject<BackupCSISnapshotContent>>,
    }).pipe(
      map(({ snapshots, contents }) =>
        csiSnapshots(
          snapshots.items.filter(
            (item) =>
              !item.metadata?.labels?.['velero.io/backup-uid'] ||
              item.metadata.labels['velero.io/backup-uid'] ===
                backup.metadata.uid
          ),
          contents.items.filter(
            (item) =>
              !item.metadata?.labels?.['velero.io/backup-uid'] ||
              item.metadata.labels['velero.io/backup-uid'] ===
                backup.metadata.uid
          )
        )
      )
    );
  }

  private metadata<T>(
    name: string,
    kind: V1DownloadTargetKind
  ): Observable<T[]> {
    return this.downloads.create({ name, kind }).pipe(
      concatMap((request) =>
        this.http.get<ArrayBuffer>(request.status.downloadURL, {
          responseType: 'arraybuffer',
        })
      ),
      map((response) => {
        const value: unknown = JSON.parse(unzipSync(response.data).toString());
        // Go nil slices are persisted as JSON null in older archives.
        if (value === null) return [];
        if (
          !Array.isArray(value) ||
          value.some(
            (item) => !item || typeof item !== 'object' || Array.isArray(item)
          )
        ) {
          throw new Error('Invalid snapshot metadata');
        }
        return value as T[];
      })
    );
  }
}
