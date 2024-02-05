import { Inject, Injectable } from '@nestjs/common';
import { CustomObjectsApi, KubeConfig } from '@kubernetes/client-node';
import { K8S_CONNECTION } from '../../shared/modules/k8s/k8s.constants';
import { from, map, Observable } from 'rxjs';
import { VELERO } from '../../shared/modules/velero/velero.constants';
import http from 'http';
import { ConfigService } from '@nestjs/config';
import { Ressources, V1Restore, V1RestoreList } from '@velero-ui/velero';

@Injectable()
export class RestoreService {
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
  ): Observable<V1RestoreList> {
    return from(
      this.k8sCustomObjectApi.listClusterCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        Ressources.RESTORE.plurial
      )
    )
      .pipe(
        map(
          (r: { response: http.IncomingMessage; body: V1RestoreList }) => r.body
        )
      )
      .pipe(
        map((r: V1RestoreList) => ({
          ...r,
          total: r.items.length,
          items: (r.items = r.items
            .filter((i: V1Restore) => i.metadata.name.includes(search))
            .slice(offset, offset + limit)),
        }))
      );
  }
}
