import { Injectable } from '@nestjs/common';
import {concatMap, forkJoin, map, Observable, of} from 'rxjs';
import {
  BackupsStatusStats,
  BackupsSuccessRateStats,
  BasicStats,
} from '@velero-ui/shared-types';
import { K8sCustomObjectService } from '@velero-ui-api/shared/modules/k8s-custom-object/k8s-custom-object.service';
import {
  Ressources,
  V1Backup,
  V1BackupList,
  V1BackupPhase,
} from '@velero-ui/velero';

@Injectable()
export class StatsService {
  constructor(
    private readonly k8sCustomObjectService: K8sCustomObjectService
  ) {}

  public getBasicStats(): Observable<BasicStats> {
    return forkJoin({
      totalBackups: this.k8sCustomObjectService.count(
        Ressources.BACKUP.plurial
      ),
      totalSchedules: this.k8sCustomObjectService.count(
        Ressources.SCHEDULE.plurial
      ),
      totalRestores: this.k8sCustomObjectService.count(
        Ressources.RESTORE.plurial
      ),
      totalStorageLocations: this.k8sCustomObjectService.count(
        Ressources.BACKUP_STORAGE_LOCATION.plurial
      ),
    });
  }

  public getBackupsStatus(): Observable<BackupsStatusStats> {
    return this.k8sCustomObjectService
      .get<V1Backup, V1BackupList>(Ressources.BACKUP.plurial)
      .pipe(
        concatMap(
          (backupList: V1BackupList): Observable<BackupsStatusStats> => {
            const stats: BackupsStatusStats = {
              labels: [],
              series: [],
            };
            for (const backup of backupList.items) {
              if (stats.labels.includes(backup?.status?.phase)) {
                const index: number = stats.labels.findIndex(
                  (e: string): boolean => e === backup?.status?.phase
                );
                stats.series[index] += 1;
              } else {
                stats.labels.push(backup.status.phase);
                stats.series.push(1);
              }
            }
            return of(stats);
          }
        )
      );
  }

  public getBackupsSuccessRate(): Observable<BackupsSuccessRateStats> {
    return this.k8sCustomObjectService
      .get<V1Backup, V1BackupList>(Ressources.BACKUP.plurial)
      .pipe(
        concatMap(
          (backupList: V1BackupList): Observable<BackupsSuccessRateStats> => {
            const stats: BackupsSuccessRateStats = {
              series: [],
            };
            let success: number = 0;
            for (const backup of backupList.items) {
              if (backup.status.phase === V1BackupPhase.Completed) {
                success += 1;
              }
            }
            stats.series.push(Math.round((success * 100) / backupList.total));
            return of(stats);
          }
        )
      );
  }
}
