import { Inject, Injectable } from '@nestjs/common';
import {
  CustomObjectsApi,
  KubeConfig,
  KubernetesListObject,
  KubernetesObject,
} from '@kubernetes/client-node';
import { K8S_CONNECTION } from '@velero-ui-api/shared/modules/k8s/k8s.constants';
import { VeleroService } from '@velero-ui-api/shared/modules/velero/velero.service';
import { ConfigService } from '@nestjs/config';
import { catchError, from, map, Observable, of } from 'rxjs';
import { VELERO } from '@velero-ui-api/shared/modules/velero/velero.constants';
import http from 'http';

@Injectable()
export class K8sCustomObjectService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private readonly veleroService: VeleroService,
    private configService: ConfigService
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }

  public get<R extends KubernetesObject, T extends KubernetesListObject<R>>(
    plurial: string,
    offset: number = 0,
    limit: number = 20,
    search?: string
  ): Observable<T> {
    return from(
      this.k8sCustomObjectApi.listNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        plurial
      )
    )
      .pipe(map((r: { response: http.IncomingMessage; body: T }): T => r.body))
      .pipe(
        map(
          (r: T): T => ({
            ...r,
            total: r.items.length,
            items: (r.items = r.items.filter((i: R) =>
              i.metadata.name.includes(search)
            )),
          })
        )
      )
      .pipe(
        map(
          (r: T): T => ({
            ...r,
            total: r.items.length,
            items: (r.items = r.items.slice(offset, offset + limit)),
          })
        )
      );
  }

  public getByName<T extends KubernetesObject>(
    plurial: string,
    name: string
  ): Observable<T> {
    return from(
      this.k8sCustomObjectApi.getNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        plurial,
        name
      )
    ).pipe(map((r: { response: http.IncomingMessage; body: T }): T => r.body));
  }

  public count(plurial: string): Observable<number> {
    return from(
      this.k8sCustomObjectApi.listNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        plurial
      )
    ).pipe(
      map(
        (r: {
          response: http.IncomingMessage;
          body: { items: number };
        }): number => r.body.items
      ),
      catchError(() => of(0))
    );
  }
}
