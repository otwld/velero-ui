import { Inject, Injectable } from '@nestjs/common';
import { forkJoin, from, map, Observable, switchMap } from 'rxjs';
import { CronExpression, CronExpressionParser } from 'cron-parser';
import {
  BackupsLatest,
  BackupsNextScheduled,
  BackupsStatusStats,
  BackupsSuccessRateStats,
  BasicStats,
  KubernetesListObjectWithFilters,
  RestoresStatusStats,
  RestoresSuccessRateStats,
  SortBy,
  SortDirection,
} from '@velero-ui/shared-types';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import {
  Resources,
  V1Backup,
  V1BackupPhase,
  V1Restore,
  V1RestorePhase,
  V1Schedule,
} from '@velero-ui/velero';
import {
  getBackupsStatusColor,
  getRestoresStatusColor,
} from '@velero-ui-api/shared/utils/stats.utils';
import {
  CoreV1Api,
  KubeConfig,
  V1Namespace,
  V1NamespaceList,
} from '@kubernetes/client-node';
import { K8S_CONNECTION } from '@velero-ui-api/shared/utils/k8s.utils';

@Injectable()
export class StatsService {
  private k8sCoreApi: CoreV1Api;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private readonly k8sCustomObjectService: K8sCustomObjectService
  ) {
    this.k8sCoreApi = this.k8s.makeApiClient(CoreV1Api);
  }

  public getBasicStats(): Observable<BasicStats> {
    return forkJoin({
      totalBackups: this.k8sCustomObjectService.count(Resources.BACKUP.plural),
      totalSchedules: this.k8sCustomObjectService.count(
        Resources.SCHEDULE.plural
      ),
      totalRestores: this.k8sCustomObjectService.count(
        Resources.RESTORE.plural
      ),
      totalStorageLocations: this.k8sCustomObjectService.count(
        Resources.BACKUP_STORAGE_LOCATION.plural
      ),
    });
  }

  public getBackupsStatus(): Observable<BackupsStatusStats> {
    return this.k8sCustomObjectService
      .get<V1Backup>(Resources.BACKUP.plural)
      .pipe(
        map(
          (
            backupList: KubernetesListObjectWithFilters<V1Backup>
          ): BackupsStatusStats => {
            const stats: BackupsStatusStats = {
              labels: [],
              series: [],
              colors: [],
            };
            for (const backup of backupList.items) {
              if (stats.labels.includes(backup?.status?.phase)) {
                const index: number = stats.labels.findIndex(
                  (e: string): boolean => e === backup?.status?.phase
                );
                stats.series[index] += 1;
              } else {
                stats.labels.push(backup.status?.phase);
                stats.series.push(1);
              }
            }

            for (const label of stats.labels) {
              stats.colors.push(getBackupsStatusColor(label));
            }
            return stats;
          }
        )
      );
  }

  public getBackupsSuccessRate(): Observable<BackupsSuccessRateStats> {
    return this.k8sCustomObjectService
      .get<V1Backup>(Resources.BACKUP.plural)
      .pipe(
        map(
          (
            backupList: KubernetesListObjectWithFilters<V1Backup>
          ): BackupsSuccessRateStats => {
            const stats: BackupsSuccessRateStats = {
              series: [],
            };
            let success = 0;
            for (const backup of backupList.items) {
              if (backup?.status?.phase === V1BackupPhase.Completed) {
                success += 1;
              }
            }
            if (success > 0) {
              stats.series.push(Math.round((success * 100) / backupList.total));
            }
            return stats;
          }
        )
      );
  }

  public getRestoresStatus(): Observable<RestoresStatusStats> {
    return this.k8sCustomObjectService
      .get<V1Restore>(Resources.RESTORE.plural)
      .pipe(
        map(
          (
            restoreList: KubernetesListObjectWithFilters<V1Restore>
          ): RestoresStatusStats => {
            const stats: RestoresStatusStats = {
              labels: [],
              series: [],
              colors: [],
            };
            for (const restore of restoreList.items) {
              if (stats.labels.includes(restore?.status?.phase)) {
                const index: number = stats.labels.findIndex(
                  (e: string): boolean => e === restore?.status?.phase
                );
                stats.series[index] += 1;
              } else {
                stats.labels.push(restore.status?.phase);
                stats.series.push(1);
              }
            }

            for (const label of stats.labels) {
              stats.colors.push(getRestoresStatusColor(label));
            }
            return stats;
          }
        )
      );
  }

  public getRestoresSuccessRate(): Observable<RestoresSuccessRateStats> {
    return this.k8sCustomObjectService
      .get<V1Restore>(Resources.RESTORE.plural)
      .pipe(
        map(
          (
            restoreList: KubernetesListObjectWithFilters<V1Restore>
          ): RestoresSuccessRateStats => {
            const stats: RestoresSuccessRateStats = {
              series: [],
            };
            let success = 0;
            for (const restore of restoreList.items) {
              if (restore?.status?.phase === V1RestorePhase.Completed) {
                success += 1;
              }
            }
            if (success > 0) {
              stats.series.push(
                Math.round((success * 100) / restoreList.total)
              );
            }
            return stats;
          }
        )
      );
  }

  public getUnscheduledNamespaces(): Observable<string[]> {
    return from(this.k8sCoreApi.listNamespace()).pipe(
      map((response: V1NamespaceList) =>
        response.items
          .filter(
            (ns: V1Namespace) =>
              !ns.metadata.labels?.['velero.io/exclude-from-backup']
          )
          .map((ns: V1Namespace) => ns.metadata?.name)
      ),
      switchMap(
        (allNamespaces: string[]): Observable<string[]> =>
          this.k8sCustomObjectService
            .get<V1Schedule>(Resources.SCHEDULE.plural)
            .pipe(
              map(
                (scheduleList: KubernetesListObjectWithFilters<V1Schedule>) => {
                  const scheduledNamespaces = new Set<string>();
                  let hasWildcard = false;

                  scheduleList.items.forEach((schedule: V1Schedule) => {
                    const included: string[] =
                      schedule.spec?.template?.includedNamespaces;
                    const excluded: string[] =
                      schedule.spec?.template?.excludedNamespaces;

                    if (included?.includes('*') || !included) {
                      hasWildcard = true;
                    } else {
                      included?.forEach((ns) => scheduledNamespaces.add(ns));
                    }

                    excluded?.forEach((namespace: string) =>
                      scheduledNamespaces.add(namespace)
                    );
                  });

                  return hasWildcard
                    ? ['*']
                    : allNamespaces.filter(
                        (namespace: string) =>
                          !scheduledNamespaces.has(namespace)
                      );
                }
              )
            )
      )
    );
  }

  public getNextScheduledBackups(): Observable<BackupsNextScheduled[]> {
    return this.k8sCustomObjectService
      .get<V1Schedule>(Resources.SCHEDULE.plural)
      .pipe(
        map((scheduleList: KubernetesListObjectWithFilters<V1Schedule>) => {
          return scheduleList.items
            .map((schedule: V1Schedule) => {
              const cron: CronExpression = CronExpressionParser.parse(
                schedule.spec.schedule
              );
              if (cron.hasNext() && !schedule.spec.skipImmediately) {
                return {
                  name: schedule.metadata.name,
                  schedule: schedule.spec.schedule,
                  nextRun: cron.next().toDate().toISOString(),
                } as BackupsNextScheduled;
              }
              return null;
            })
            .filter(Boolean)
            .filter(
              (schedule: BackupsNextScheduled) =>
                new Date(schedule.nextRun).getTime() - new Date().getTime() <=
                24 * 60 * 60 * 1000
            )
            .sort(
              (a: BackupsNextScheduled, b: BackupsNextScheduled) =>
                new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime()
            );
        })
      );
  }

  public getBackupLatest(): Observable<BackupsLatest[]> {
    return this.k8sCustomObjectService
      .get<V1Backup>(Resources.BACKUP.plural, {
        sortBy: SortBy.CompletionTimestamp,
        sortDirection: SortDirection.Descending,
      })
      .pipe(
        map((backupList: KubernetesListObjectWithFilters<V1Backup>) =>
          backupList.items
            .map((backup: V1Backup) => ({
              name: backup.metadata.name,
              date: backup.status.completionTimestamp,
              phase: backup.status.phase,
            }))
            .filter(
              (backup: BackupsLatest) =>
                new Date().getTime() - new Date(backup.date).getTime() <=
                24 * 60 * 60 * 1000
            )
        )
      );
  }
}
