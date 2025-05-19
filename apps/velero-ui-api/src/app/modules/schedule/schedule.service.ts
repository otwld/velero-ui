import { Inject, Injectable } from '@nestjs/common';
import {
  CustomObjectsApi,
  KubeConfig,
  KubernetesObject,
  PatchStrategy,
  setHeaderOptions,
} from '@kubernetes/client-node';
import { K8S_CONNECTION } from '@velero-ui-api/shared/utils/k8s.utils';
import {
  catchError,
  concatMap,
  forkJoin,
  lastValueFrom,
  map,
  Observable,
  of, switchMap,
  tap,
} from 'rxjs';
import {
  Resources,
  V1Backup,
  V1BackupList,
  V1PodVolumeBackup,
  V1PodVolumeBackupList,
  type V1PodVolumeRestore,
  V1Schedule,
} from '@velero-ui/velero';
import { ConfigService } from '@nestjs/config';
import { patchPauseSchedule } from './schedule.utils';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import {
  CreateScheduleDto,
  EditScheduleDto,
} from '@velero-ui-api/shared/dto/schedule.dto';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import {
  createK8sCustomObject,
  patchK8sCustomObjectSpec,
} from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.utils';
import { VELERO } from '@velero-ui-api/shared/modules/velero/velero.constants';
import { ScheduleStats } from '@velero-ui/shared-types';
import { BackupService } from '@velero-ui-api/modules/backup/backup.service';

@Injectable()
export class ScheduleService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private logger: AppLogger,
    private configService: ConfigService,
    private readonly k8sCustomObjectService: K8sCustomObjectService,
    private readonly backupService: BackupService
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }

  public create(data: CreateScheduleDto): Observable<V1Schedule> {
    return of(
      createK8sCustomObject(
        data.name,
        this.configService.get('velero.namespace'),
        Resources.SCHEDULE,
        data.labels,
        data.spec
      )
    ).pipe(
      concatMap((body: KubernetesObject) =>
        this.k8sCustomObjectService.create(Resources.SCHEDULE.plural, body)
      )
    );
  }

  public edit(name: string, data: EditScheduleDto): Observable<V1Schedule> {
    return of(patchK8sCustomObjectSpec(data.spec)).pipe(
      concatMap((body) =>
        this.k8sCustomObjectService.edit(Resources.SCHEDULE.plural, name, body)
      )
    );
  }

  public togglePause(name: string, paused: boolean): Observable<V1Schedule> {
    this.logger.debug(
      `Toggle ${paused ? 'paused' : 'resumed'} for ${name}...`,
      ScheduleService.name
    );

    return of(patchPauseSchedule(paused))
      .pipe(
        concatMap((body) =>
          this.k8sCustomObjectApi.patchNamespacedCustomObject(
            {
              group: VELERO.GROUP,
              version: VELERO.VERSION,
              namespace: this.configService.get('velero.namespace'),
              plural: Resources.SCHEDULE.plural,
              name,
              body,
            },
            setHeaderOptions('Content-Type', PatchStrategy.JsonPatch)
          )
        )
      )
      .pipe(
        tap(() =>
          this.logger.debug(
            `Toggle ${paused ? 'paused' : 'resumed'} for ${name}... SUCCESS`,
            ScheduleService.name
          )
        )
      );
  }

  public stats(name: string): Observable<ScheduleStats> {
    const backups: Observable<V1BackupList> = this.k8sCustomObjectService.get<V1Backup, V1BackupList>(
      Resources.BACKUP.plural,
      0,
      0,
      name,
      'Date',
      true
    );

    const podVolumes: Observable<V1PodVolumeBackupList> = this.k8sCustomObjectService.get<
      V1PodVolumeBackup,
      V1PodVolumeBackupList
    >(Resources.POD_VOLUME_BACKUP.plural, 0, 0, name);

    return forkJoin([backups, podVolumes]).pipe(
      switchMap(([backups, podVolumes]) => {
        return forkJoin(
          backups.items.map((backup: V1Backup) =>
            this.backupService.getContentSize(backup.metadata.name).pipe(
              catchError(() => of(0)),
              map((size) => ({ name: backup.metadata.name, size }))
            )
          )
        ).pipe(
          map((backupsContentSizes) => {
            const stats: ScheduleStats = {
              duration: { series: [{ name: 'Duration', data: [] }] },
              size: {
                series: [
                  { name: 'Pod Volumes', data: [] },
                  { name: 'Backup Content', data: [] },
                  { name: 'Total', data: [] },
                ],
              },
              items: { series: [{ name: 'Items', data: [] }] },
            };

            for (const backup of backups.items) {
              const backupName = backup.metadata.name.slice(name.length + 1);

              const contentSize: number =
                backupsContentSizes.find((v) => v.name === backup.metadata.name)
                  ?.size || 0;

              const durationMs: number =
                new Date(backup.status.completionTimestamp).getTime() -
                new Date(backup.status.startTimestamp).getTime();

              stats.duration.series[0].data.push({
                x: backupName,
                y: durationMs / 1000,
              });

              stats.items.series[0].data.push({
                x: backupName,
                y: backup.status.progress.itemsBackedUp,
              });

              const podVolumeSize: number = podVolumes.items
                .filter((pv: V1PodVolumeBackup) => pv.metadata.name.includes(backup.metadata.name))
                .reduce(
                  (acc: number, pv: V1PodVolumeBackup) => acc + (pv.status?.progress?.bytesDone || 0),
                  0
                );

              stats.size.series[0].data.push({
                x: backupName,
                y: podVolumeSize,
              });
              stats.size.series[1].data.push({ x: backupName, y: contentSize });
              stats.size.series[2].data.push({
                x: backupName,
                y: podVolumeSize + contentSize,
              });
            }

            return stats;
          })
        );
      })
    );
  }
}
