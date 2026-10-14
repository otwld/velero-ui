import { Inject, Injectable } from '@nestjs/common';
import {
  CustomObjectsApi,
  KubeConfig,
  KubernetesListObject,
} from '@kubernetes/client-node';
import { HttpService } from '@nestjs/axios';
import {
  catchError,
  concatMap,
  forkJoin,
  map,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { createHash } from 'node:crypto';
import { unzipSync } from 'node:zlib';
import {
  BackupCSISnapshot,
  BackupCSISnapshotContent,
  BackupNativeSnapshot,
  BackupSnapshot,
  Resources,
  V1Backup,
  V1BackupPhase,
  V1DownloadTargetKind,
} from '@velero-ui/velero';
import { K8S_CONNECTION } from '../../shared/utils/k8s.utils';
import { K8sCustomObjectService } from '../k8s-custom-object/k8s-custom-object.service';
import { DownloadRequestService } from '../download-request/download-request.service';
import { csiSnapshots, nativeSnapshots } from './backup-snapshots.utils';

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

  get(name: string): Observable<BackupSnapshot[]> {
    return this.objects.getByName<V1Backup>(Resources.BACKUP.plural, name).pipe(
      concatMap((backup) => {
        const finished = [
          V1BackupPhase.Completed,
          V1BackupPhase.PartiallyFailed,
          V1BackupPhase.Failed,
        ].includes(backup.status?.phase);
        if (!finished) {
          // No CSI objects are expected when snapshots are explicitly disabled.
          if (backup.spec?.snapshotVolumes === false) return of([]);
          return this.liveCSI(backup);
        }
        // Archived metadata remains available after temporary CSI objects are deleted.
        const native = backup.status?.volumeSnapshotsAttempted
          ? this.metadata<BackupNativeSnapshot>(
              name,
              V1DownloadTargetKind.BackupVolumeSnapshots
            ).pipe(map(nativeSnapshots))
          : of([]);
        const csi = backup.status?.csiVolumeSnapshotsAttempted
          ? forkJoin({
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
          : of([]);
        return forkJoin({ native, csi }).pipe(
          map(({ native, csi }) => [...native, ...csi])
        );
      })
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
      ),
      catchError((error) =>
        error.code === 404 ? of([]) : throwError(() => error)
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
      map(
        (response) =>
          (JSON.parse(unzipSync(response.data).toString()) || []) as T[]
      )
    );
  }
}
