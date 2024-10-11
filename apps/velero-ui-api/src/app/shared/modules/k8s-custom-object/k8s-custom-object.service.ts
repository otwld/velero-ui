import { Inject, Injectable } from '@nestjs/common';
import {
  CustomObjectsApi,
  KubeConfig,
  KubernetesListObject, KubernetesObject,
} from '@kubernetes/client-node';
import { K8S_CONNECTION } from '@velero-ui-api/shared/modules/k8s/k8s.constants';
import { VeleroService } from '@velero-ui-api/shared/modules/velero/velero.service';
import { ConfigService } from '@nestjs/config';
import { catchError, from, map, Observable, of } from 'rxjs';
import { VELERO } from '@velero-ui-api/shared/modules/velero/velero.constants';
import http from 'http';
import { sortObjects } from '@velero-ui-api/shared/utils/sorts.utils';

@Injectable()
export class K8sCustomObjectService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private readonly veleroService: VeleroService,
    private configService: ConfigService,
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }

  public get<R extends KubernetesObject, T extends KubernetesListObject<R>>(
    plural: string,
    offset: number = 0,
    limit?: number,
    search?: string,
    sortColumnName?: string,
    sortColumnAscending?: boolean,
  ): Observable<T> {
    return from(
      this.k8sCustomObjectApi.listNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        plural,
      ),
    )
      .pipe(map((r: { response: http.IncomingMessage; body: T }): T => r.body))
      .pipe(
        map(
          (r: T): T => ({
            ...r,
            total: r.items.length,
            items: (r.items = r.items.filter((i: R) =>
              search ? i.metadata.name.includes(search) : i,
            )),
          }),
        ),
      )
      .pipe(
        map(
          (r: T): T => ({
            ...r,
            total: r.items.length,
            items: (r.items = sortObjects(
              r.items,
              sortColumnName,
              sortColumnAscending,
            )),
          }),
        ),
      )
      .pipe(
        map(
          (r: T): T => ({
            ...r,
            total: r.items.length,
            items: limit
              ? (r.items = r.items.slice(offset, offset + limit))
              : r.items,
          }),
        ),
      );
  }

  /*public async get<
    R extends KubernetesObject,
    T extends KubernetesListObject<R>,
  >(plural: string, offset: number = 0, limit?: number, search?: string): Observable<any> {
    try {
      const response = <
        {
          response: http.IncomingMessage;
          body: T;
        }
      >await this.k8sCustomObjectApi.listNamespacedCustomObject(VELERO.GROUP, VELERO.VERSION, this.configService.get('velero.namespace'), plural);

      const items: R[] = response.body.items
        .filter((i: R) => (search ? i.metadata.name.includes(search) : i))
        .slice(offset, offset + limit);

      return of({
        total: r.items.length,
        items,
      });
    } catch (e) {
      console.error(e);
    }
  }*/

  public getByName<T extends KubernetesObject>(
    plural: string,
    name: string,
  ): Observable<T> {
    return from(
      this.k8sCustomObjectApi.getNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        plural,
        name,
      ),
    ).pipe(map((r: { response: http.IncomingMessage; body: T }): T => r.body));
  }

  public count(plural: string): Observable<number> {
    return from(
      this.k8sCustomObjectApi.listNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        plural,
      ),
    ).pipe(
      map(
        (r: { response: http.IncomingMessage; body: { items: [] } }): number =>
          r.body.items.length,
      ),
      catchError(() => of(0)),
    );
  }

  public create(plural: string, body: object) {
    return from(
      this.k8sCustomObjectApi.createNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        plural,
        body,
      ),
    );
  }
}
