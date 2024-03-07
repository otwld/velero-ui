import { Injectable } from '@nestjs/common';
import {forkJoin, Observable} from 'rxjs';
import { BasicStats } from '@velero-ui/shared-types';
import { K8sCustomObjectService } from '@velero-ui-api/shared/modules/k8s-custom-object/k8s-custom-object.service';
import { Ressources } from '@velero-ui/velero';

@Injectable()
export class StatsService {
  constructor(
    private readonly k8sCustomObjectService: K8sCustomObjectService
  ) {}

  public getBasicStats(): Observable<BasicStats> {
    return forkJoin({
      totalBackups: this.k8sCustomObjectService.count(Ressources.BACKUP.plurial),
      totalSchedules: this.k8sCustomObjectService.count(Ressources.SCHEDULE.plurial),
      totalRestores: this.k8sCustomObjectService.count(Ressources.RESTORE.plurial),
      totalStorageLocations: this.k8sCustomObjectService.count(Ressources.BACKUP_STORAGE_LOCATION.plurial),
    })
  }
}
