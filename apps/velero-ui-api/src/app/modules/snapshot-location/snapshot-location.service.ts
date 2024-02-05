import { Inject, Injectable } from '@nestjs/common';
import { K8S_CONNECTION } from '../../shared/modules/k8s/k8s.constants';
import { CustomObjectsApi, KubeConfig } from '@kubernetes/client-node';
import { from, map, Observable } from 'rxjs';
import {
  Ressources,
  V1VolumeSnapshotLocation,
  V1VolumeSnapshotLocationList,
} from '@velero-ui/velero';
import { VELERO } from '../../shared/modules/velero/velero.constants';
import http from 'http';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SnapshotLocationService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private configService: ConfigService
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }

  public find(
    offset: number = 0,
    limit: number = 20,
    search?: string
  ): Observable<V1VolumeSnapshotLocationList> {
    return from(
      this.k8sCustomObjectApi.listNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        Ressources.VOLUME_SNAPSHOT_LOCATION.plurial
      )
    )
      .pipe(
        map(
          (r: {
            response: http.IncomingMessage;
            body: V1VolumeSnapshotLocationList;
          }): V1VolumeSnapshotLocationList => r.body
        )
      )
      .pipe(
        map((r: V1VolumeSnapshotLocationList) => ({
          ...r,
          total: r.items.length,
          items: (r.items = r.items
            .filter((i: V1VolumeSnapshotLocation) =>
              i.metadata.name.includes(search)
            )
            .slice(offset, offset + limit)),
        }))
      );
  }

  public findByName(name: string): Observable<V1VolumeSnapshotLocation> {
    return from(
      this.k8sCustomObjectApi.getNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        Ressources.VOLUME_SNAPSHOT_LOCATION.plurial,
        name
      )
    ).pipe(
      map((r: { response: http.IncomingMessage; body: V1VolumeSnapshotLocation }) => r.body)
    );
  }
}
