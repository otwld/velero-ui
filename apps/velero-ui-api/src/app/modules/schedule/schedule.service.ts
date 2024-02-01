import { Inject, Injectable } from '@nestjs/common';
import { CustomObjectsApi, KubeConfig } from '@kubernetes/client-node';
import { K8S_CONNECTION } from '../../shared/modules/k8s/k8s.constants';
import { from, map, Observable } from 'rxjs';
import { VELERO } from '../../shared/constants/velero.constants';
import http from 'http';
import { V1Schedule, V1ScheduleList } from '@velero-ui/shared-types';

@Injectable()
export class ScheduleService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(@Inject(K8S_CONNECTION) private readonly k8s: KubeConfig) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }

  public find(
    offset: number = 0,
    limit: number = 20,
    search?: string
  ): Observable<V1ScheduleList> {
    return from(
      this.k8sCustomObjectApi.listClusterCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        VELERO.PLURAL_SCHEDULES
      )
    )
      .pipe(
        map(
          (r: { response: http.IncomingMessage; body: any }): V1ScheduleList =>
            r.body
        )
      )
      .pipe(
        map((r: V1ScheduleList) => ({
          ...r,
          total: r.items.length,
          items: (r.items = r.items
            .filter((i: V1Schedule) => i.metadata.name.includes(search))
            .slice(offset, offset + limit)),
        }))
      );
  }

  public findByName(name: string, namespace: string): Observable<V1Schedule> {
    return from(
      this.k8sCustomObjectApi.getNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        namespace,
        VELERO.PLURAL_SCHEDULES,
        name
      )
    ).pipe(
      map((r: { response: http.IncomingMessage; body: V1Schedule }) => r.body)
    );
  }
}
