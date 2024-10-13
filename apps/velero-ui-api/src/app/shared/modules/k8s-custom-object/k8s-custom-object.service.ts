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
import {catchError, concatMap, from, map, mergeMap, Observable, of} from 'rxjs';
import { VELERO } from '@velero-ui-api/shared/modules/velero/velero.constants';
import http from 'http';
import { sortObjects } from '@velero-ui-api/shared/utils/sorts.utils';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';

@Injectable()
export class K8sCustomObjectService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private logger: AppLogger,
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
    this.logger.debug(
      `Fetching resources in "${plural}" (offset: ${offset}, limit: ${limit}, search: ${search}, sortColumnName: ${sortColumnName}, sortColumnAscending: ${sortColumnAscending})...`,
      K8sCustomObjectService.name,
    );
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

  public getByName<T extends KubernetesObject>(
    plural: string,
    name: string,
  ): Observable<T> {
    this.logger.debug(
      `Fetching resource ${name} in "${plural}"...`,
      K8sCustomObjectService.name,
    );
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
    this.logger.debug(
      `Counting resources "${plural}"...`,
      K8sCustomObjectService.name,
    );
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
    this.logger.debug(
      `Creating resource in "${plural}": ${body}`,
      K8sCustomObjectService.name,
    );
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

  public delete(plural: string, names: string[]): void {
    this.logger.debug(
      `Deleting resources ${names.join(',')} in "${plural}"...`,
      K8sCustomObjectService.name,
    );
    from(names).pipe(
      concatMap((name: string) =>
        this.k8sCustomObjectApi.deleteNamespacedCustomObject(
          VELERO.GROUP,
          VELERO.VERSION,
          this.configService.get('velero.namespace'),
          plural,
          name,
        ),
      ),
    );
  }

  public deleteByName(plural: string, name: string): void {
    this.logger.debug(
      `Deleting resource ${name} in "${plural}"...`,
      K8sCustomObjectService.name,
    );
    from(
      this.k8sCustomObjectApi.deleteNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        plural,
        name,
      ),
    );
  }
}
