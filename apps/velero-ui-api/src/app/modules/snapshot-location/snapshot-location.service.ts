import { Inject, Injectable } from '@nestjs/common';
import { K8S_CONNECTION } from '../../shared/modules/k8s/k8s.constants';
import { KubeConfig } from '@kubernetes/client-node';
import { concatMap, of } from 'rxjs';
import { Resources } from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import { ConfigService } from '@nestjs/config';
import {
  CreateVolumeSnapshotLocationDto,
  EditVolumeSnapshotLocationDto,
} from '@velero-ui-api/shared/dto/snapshot-location.dto';
import {
  createK8sCustomObject,
  patchK8sCustomObjectSpec,
} from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.utils';
import { KubernetesObjectWithSpec } from '@kubernetes/client-node/dist/types';

@Injectable()
export class SnapshotLocationService {
  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private readonly k8sCustomObjectService: K8sCustomObjectService,
    private readonly configService: ConfigService,
  ) {}

  public create(data: CreateVolumeSnapshotLocationDto) {
    return of(
      createK8sCustomObject(
        data.name,
        this.configService.get('velero.namespace'),
        Resources.VOLUME_SNAPSHOT_LOCATION,
        data.labels,
        data.spec,
      ),
    ).pipe(
      concatMap((body: KubernetesObjectWithSpec) =>
        this.k8sCustomObjectService.create(
          Resources.VOLUME_SNAPSHOT_LOCATION.plural,
          body,
        ),
      ),
    );
  }

  public edit(name: string, data: EditVolumeSnapshotLocationDto) {
    return of(patchK8sCustomObjectSpec(data.spec)).pipe(
      concatMap((body) =>
        this.k8sCustomObjectService.edit(
          Resources.VOLUME_SNAPSHOT_LOCATION.plural,
          name,
          body,
        ),
      ),
    );
  }
}
