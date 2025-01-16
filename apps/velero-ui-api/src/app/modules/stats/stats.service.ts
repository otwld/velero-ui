import { Injectable } from '@nestjs/common';
import { forkJoin, map, Observable } from 'rxjs';
import {
  BackupsStatusStats,
  BackupsSuccessRateStats,
  BasicStats,
  RestoresStatusStats,
  RestoresSuccessRateStats,
} from '@velero-ui/shared-types';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import {
  Resources,
  V1Backup,
  V1BackupList,
  V1BackupPhase,
  V1Restore,
  V1RestoreList,
  V1RestorePhase,
} from '@velero-ui/velero';
import {getBackupsStatusColor, getRestoresStatusColor} from '@velero-ui-api/shared/utils/stats.utils';

@Injectable()
export class StatsService {
  constructor(
    private readonly k8sCustomObjectService: K8sCustomObjectService,
  ) {}

  public getBasicStats(): Observable<BasicStats> {
    return forkJoin({
      totalBackups: this.k8sCustomObjectService.count(Resources.BACKUP.plural),
      totalSchedules: this.k8sCustomObjectService.count(
        Resources.SCHEDULE.plural,
      ),
      totalRestores: this.k8sCustomObjectService.count(
        Resources.RESTORE.plural,
      ),
      totalStorageLocations: this.k8sCustomObjectService.count(
        Resources.BACKUP_STORAGE_LOCATION.plural,
      ),
    });
  }

  public getBackupsStatus(): Observable<BackupsStatusStats> {
    return this.k8sCustomObjectService
      .get<V1Backup, V1BackupList>(Resources.BACKUP.plural)
      .pipe(
        map((backupList: V1BackupList): BackupsStatusStats => {
          const stats: BackupsStatusStats = {
            labels: [],
            series: [],
            colors: [],
          };
          for (const backup of backupList.items) {
            if (stats.labels.includes(backup?.status?.phase)) {
              const index: number = stats.labels.findIndex(
                (e: string): boolean => e === backup?.status?.phase,
              );
              stats.series[index] += 1;
            } else {
              stats.labels.push(backup.status.phase);
              stats.series.push(1);
            }
          }

          for (const label of stats.labels) {
            stats.colors.push(getBackupsStatusColor(label));
          }
          return stats;
        }),
      );
  }

  public getBackupsSuccessRate(): Observable<BackupsSuccessRateStats> {
    return this.k8sCustomObjectService
      .get<V1Backup, V1BackupList>(Resources.BACKUP.plural)
      .pipe(
        map((backupList: V1BackupList): BackupsSuccessRateStats => {
          const stats: BackupsSuccessRateStats = {
            series: [],
          };
          let success = 0;
          for (const backup of backupList.items) {
            if (backup.status.phase === V1BackupPhase.Completed) {
              success += 1;
            }
          }
          if (success > 0) {
            stats.series.push(Math.round((success * 100) / backupList.total));
          }
          return stats;
        }),
      );
  }

  public getRestoresStatus(): Observable<RestoresStatusStats> {
    return this.k8sCustomObjectService
      .get<V1Restore, V1RestoreList>(Resources.RESTORE.plural)
      .pipe(
        map((restoreList: V1RestoreList): RestoresStatusStats => {
          const stats: RestoresStatusStats = {
            labels: [],
            series: [],
            colors: [],
          };
          for (const restore of restoreList.items) {
            if (stats.labels.includes(restore?.status?.phase)) {
              const index: number = stats.labels.findIndex(
                (e: string): boolean => e === restore?.status?.phase,
              );
              stats.series[index] += 1;
            } else {
              stats.labels.push(restore.status.phase);
              stats.series.push(1);
            }
          }

          for (const label of stats.labels) {
            stats.colors.push(getRestoresStatusColor(label));
          }
          return stats;
        }),
      );
  }

  public getRestoresSuccessRate(): Observable<RestoresSuccessRateStats> {
    return this.k8sCustomObjectService
      .get<V1Restore, V1RestoreList>(Resources.RESTORE.plural)
      .pipe(
        map((restoreList: V1RestoreList): RestoresSuccessRateStats => {
          const stats: RestoresSuccessRateStats = {
            series: [],
          };
          let success = 0;
          for (const restore of restoreList.items) {
            if (restore.status.phase === V1RestorePhase.Completed) {
              success += 1;
            }
          }
          if (success > 0) {
            stats.series.push(Math.round((success * 100) / restoreList.total));
          }
          return stats;
        }),
      );
  }
}
