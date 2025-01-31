import { Injectable } from '@nestjs/common';
import { KubernetesObject } from '@kubernetes/client-node';
import { concatMap, Observable, of } from 'rxjs';
import { Resources, V1VolumeSnapshotLocation } from '@velero-ui/velero';
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

@Injectable()
export class SnapshotLocationService {
  constructor(
    private readonly k8sCustomObjectService: K8sCustomObjectService,
    private readonly configService: ConfigService,
  ) {}

  public create(
    data: CreateVolumeSnapshotLocationDto,
  ): Observable<V1VolumeSnapshotLocation> {
    return of(
      createK8sCustomObject(
        data.name,
        this.configService.get('velero.namespace'),
        Resources.VOLUME_SNAPSHOT_LOCATION,
        data.labels,
        data.spec,
      ),
    ).pipe(
      concatMap((body: KubernetesObject) =>
        this.k8sCustomObjectService.create(
          Resources.VOLUME_SNAPSHOT_LOCATION.plural,
          body,
        ),
      ),
    );
  }

  public edit(
    name: string,
    data: EditVolumeSnapshotLocationDto,
  ): Observable<V1VolumeSnapshotLocation> {
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
