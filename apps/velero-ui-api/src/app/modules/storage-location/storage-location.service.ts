import { Injectable } from '@nestjs/common';
import { KubernetesObject } from '@kubernetes/client-node';
import {
  CreateStorageLocationDto,
  EditStorageLocationDto,
} from '@velero-ui-api/shared/dto/storage-location.dto';
import { concatMap, Observable, of } from 'rxjs';
import { Resources, V1BackupStorageLocation } from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import { ConfigService } from '@nestjs/config';
import {
  createK8sCustomObject,
  patchK8sCustomObjectSpec,
} from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.utils';

@Injectable()
export class StorageLocationService {
  constructor(
    private readonly k8sCustomObjectService: K8sCustomObjectService,
    private configService: ConfigService,
  ) {}

  public create(
    data: CreateStorageLocationDto,
  ): Observable<V1BackupStorageLocation> {
    return of(
      createK8sCustomObject(
        data.name,
        this.configService.get('velero.namespace'),
        Resources.BACKUP_STORAGE_LOCATION,
        data.labels,
        data.spec,
      ),
    ).pipe(
      concatMap((body: KubernetesObject) =>
        this.k8sCustomObjectService.create(
          Resources.BACKUP_STORAGE_LOCATION.plural,
          body,
        ),
      ),
    );
  }

  public edit(
    name: string,
    data: EditStorageLocationDto,
  ): Observable<V1BackupStorageLocation> {
    return of(patchK8sCustomObjectSpec(data.spec)).pipe(
      concatMap((body) =>
        this.k8sCustomObjectService.edit(
          Resources.BACKUP_STORAGE_LOCATION.plural,
          name,
          body,
        ),
      ),
    );
  }
}
