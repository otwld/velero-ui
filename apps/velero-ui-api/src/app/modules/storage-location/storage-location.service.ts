import { Inject, Injectable } from '@nestjs/common';
import { CustomObjectsApi, KubeConfig } from '@kubernetes/client-node';
import { K8S_CONNECTION } from '../../shared/modules/k8s/k8s.constants';
import { from, map, Observable } from 'rxjs';
import { VELERO } from '../../shared/constants/velero.constants';
import http from 'http';

@Injectable()
export class StorageLocationService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(@Inject(K8S_CONNECTION) private readonly k8s: KubeConfig) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }

  public find(
    offset: number = 0,
    limit: number = 20,
    search?: string
  ): Observable<any> {
    return from(
      this.k8sCustomObjectApi.listClusterCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        VELERO.PLURAL_STORAGE_LOCATIONS
      )
    )
      .pipe(map((r: { response: http.IncomingMessage; body: any }) => r.body))
      .pipe(
        map((r) => ({
          ...r,
          total: r.items.length,
          items: (r.items = r.items
            .filter((i) => i.metadata.name.includes(search))
            .slice(offset, offset + limit)),
        }))
      );
  }
}
