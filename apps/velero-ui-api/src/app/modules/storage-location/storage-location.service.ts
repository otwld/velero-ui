import { Inject, Injectable } from '@nestjs/common';
import { KubeConfig } from '@kubernetes/client-node';
import { K8S_CONNECTION } from '../../shared/modules/k8s/k8s.constants';
import {
  CreateStorageLocationDto,
  EditStorageLocationDto,
} from '@velero-ui-api/shared/dto/storage-location.dto';
import { concatMap, of } from 'rxjs';
import { Resources } from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import { ConfigService } from '@nestjs/config';
import { KubernetesObjectWithSpec } from '@kubernetes/client-node/dist/types';
import {
  createK8sCustomObject,
  patchK8sCustomObjectSpec,
} from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.utils';

@Injectable()
export class StorageLocationService {
  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private readonly k8sCustomObjectService: K8sCustomObjectService,
    private configService: ConfigService,
  ) {}

  public create(data: CreateStorageLocationDto) {
    return of(
      createK8sCustomObject(
        data.name,
        this.configService.get('velero.namespace'),
        Resources.BACKUP_STORAGE_LOCATION,
        data.labels,
        data.spec,
      ),
    ).pipe(
      concatMap((body: KubernetesObjectWithSpec) =>
        this.k8sCustomObjectService.create(
          Resources.BACKUP_STORAGE_LOCATION.plural,
          body,
        ),
      ),
    );
  }

  public edit(name: string, data: EditStorageLocationDto) {
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
