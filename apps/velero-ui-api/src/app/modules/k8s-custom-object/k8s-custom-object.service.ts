import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  ApiException,
  CustomObjectsApi,
  KubeConfig,
  KubernetesListObject,
  KubernetesObject,
  PatchStrategy,
  setHeaderOptions,
  Watch,
} from '@kubernetes/client-node';
import { K8S_CONNECTION } from '@velero-ui-api/shared/utils/k8s.utils';
import { ConfigService } from '@nestjs/config';
import {
  catchError,
  concatMap,
  from,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { VELERO } from '@velero-ui-api/shared/modules/velero/velero.constants';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import { Socket } from 'socket.io';
import { KubernetesListObjectWithFilters, Search } from '@velero-ui/shared-types';
import { filters, slice, sort } from '@velero-ui-api/shared/utils/search.utils';
import { SearchDto } from '@velero-ui-api/shared/dto/search.dto';

@Injectable()
export class K8sCustomObjectService {
  private k8sCustomObjectApi: CustomObjectsApi;
  private k8sWatcher: Watch;

  private activeWatchers: Map<
    string,
    { name: string; controller: AbortController }
  > = new Map<string, { name: string; controller: AbortController }>();

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private logger: AppLogger,
    private configService: ConfigService
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
    this.k8sWatcher = new Watch(this.k8s);
  }

  public get<T extends KubernetesObject>(
    plural: string,
    search?: Search
  ): Observable<KubernetesListObjectWithFilters<T>> {
    this.logger.debug(
      `Fetching resources in "${plural}" (offset: ${search?.offset}, limit: ${search?.limit}, search: ${search?.search}, sortBy: ${search?.sortBy}, sortDirection: ${search?.sortDirection})...`,
      K8sCustomObjectService.name
    );
    return from(
      this.k8sCustomObjectApi.listNamespacedCustomObject({
        group: VELERO.GROUP,
        version: VELERO.VERSION,
        namespace: this.configService.get('velero.namespace'),
        plural,
      })
    ).pipe(
      map(
        (r: KubernetesListObject<T>): KubernetesListObjectWithFilters<T> =>
          filters(r, search)
      ),
      map(
        (
          r: KubernetesListObjectWithFilters<T>
        ): KubernetesListObjectWithFilters<T> =>
          sort(r, search?.sortBy, search?.sortDirection)
      ),
      map(
        (
          r: KubernetesListObjectWithFilters<T>
        ): KubernetesListObjectWithFilters<T> =>
          slice(r, search?.offset, search?.limit)
      ),
      catchError((err: ApiException<T>) => {
        console.error(err);
        this.logger.error(
          `Error while fetching "${plural}": ${err.message}`,
          K8sCustomObjectService.name
        );
        return throwError(() => new HttpException(err.message, err.code));
      })
    );
  }

  public getByName<T extends KubernetesObject>(
    plural: string,
    name: string
  ): Observable<T> {
    this.logger.debug(
      `Fetching resource ${name} in "${plural}"...`,
      K8sCustomObjectService.name
    );

    return from(
      this.k8sCustomObjectApi.getNamespacedCustomObject({
        group: VELERO.GROUP,
        version: VELERO.VERSION,
        namespace: this.configService.get('velero.namespace'),
        plural,
        name,
      })
    ).pipe(
      catchError((err: ApiException<T>) => {
        this.logger.error(
          `Error while fetching "${name}" in "${plural}": ${err.message}`,
          K8sCustomObjectService.name
        );
        return throwError(() => new HttpException(err.message, err.code));
      })
    );
  }

  public count(plural: string): Observable<number> {
    this.logger.debug(
      `Counting resources "${plural}"...`,
      K8sCustomObjectService.name
    );
    return from(
      this.k8sCustomObjectApi.listNamespacedCustomObject({
        group: VELERO.GROUP,
        version: VELERO.VERSION,
        namespace: this.configService.get('velero.namespace'),
        plural,
      })
    ).pipe(
      map(
        (r: KubernetesListObject<KubernetesObject>): number => r.items.length
      ),
      catchError(() => of(0))
    );
  }

  public create(plural: string, body: object): Observable<KubernetesObject> {
    this.logger.debug(
      `Creating resource in "${plural}": ${body}`,
      K8sCustomObjectService.name
    );
    return from(
      this.k8sCustomObjectApi.createNamespacedCustomObject({
        group: VELERO.GROUP,
        version: VELERO.VERSION,
        namespace: this.configService.get('velero.namespace'),
        plural,
        body,
      })
    ).pipe(
      catchError((e: Error) => {
        this.logger.error(e.message, K8sCustomObjectService.name);
        return throwError(() => e);
      }),
      tap((body: KubernetesObject) =>
        this.logger.debug(
          `Creating resource ${body?.metadata?.name} in "${plural}"... SUCCESS`,
          K8sCustomObjectService.name
        )
      )
    );
  }

  public edit(
    plural: string,
    name: string,
    body: object
  ): Observable<KubernetesObject> {
    this.logger.debug(
      `Editing resource  ${name} in ${plural} ...`,
      K8sCustomObjectService.name
    );

    return from(
      this.k8sCustomObjectApi.patchNamespacedCustomObject(
        {
          group: VELERO.GROUP,
          version: VELERO.VERSION,
          namespace: this.configService.get('velero.namespace'),
          plural,
          name,
          body,
        },
        setHeaderOptions('Content-Type', PatchStrategy.JsonPatch)
      )
    ).pipe(
      catchError((e: Error) => {
        this.logger.error(e.message, K8sCustomObjectService.name);
        return throwError(() => e);
      }),
      tap(() =>
        this.logger.debug(
          `Edited ${name} in ${plural}... SUCCESS`,
          K8sCustomObjectService.name
        )
      )
    );
  }

  public delete(plural: string, names: string[]): Observable<void> {
    this.logger.debug(
      `Deleting resources ${names.join(',')} in "${plural}"...`,
      K8sCustomObjectService.name
    );

    return from(names)
      .pipe(
        concatMap((name: string) =>
          this.k8sCustomObjectApi.deleteNamespacedCustomObject({
            group: VELERO.GROUP,
            version: VELERO.VERSION,
            namespace: this.configService.get('velero.namespace'),
            plural,
            name,
          })
        )
      )
      .pipe(
        catchError((e: Error) => {
          this.logger.error(e.message, K8sCustomObjectService.name);
          return throwError(() => e);
        }),
        tap(() =>
          this.logger.debug(
            `Deleting resources ${names.join(',')} in "${plural}"... SUCCESS`,
            K8sCustomObjectService.name
          )
        ),
        map(() => void 0)
      );
  }

  public deleteByName(plural: string, name: string): Observable<void> {
    this.logger.debug(
      `Deleting resource ${name} in "${plural}"...`,
      K8sCustomObjectService.name
    );

    return from(
      this.k8sCustomObjectApi.deleteNamespacedCustomObject({
        group: VELERO.GROUP,
        version: VELERO.VERSION,
        namespace: this.configService.get('velero.namespace'),
        plural,
        name,
      })
    ).pipe(
      catchError((e: Error) => {
        this.logger.error(e.message, K8sCustomObjectService.name);
        return throwError(() => e);
      }),
      tap(() =>
        this.logger.debug(
          `Deleting resource ${name} in "${plural}"... SUCCESS`,
          K8sCustomObjectService.name
        )
      ),
      map(() => void 0)
    );
  }

  public async watch(
    client: Socket,
    plural: string,
    name?: string,
    version?: string
  ) {
    if (this.activeWatchers.has(client.id)) {
      this.unWatch(client, name);
    }

    this.logger.debug(
      `Watching ${name ? name : 'resources'} in "${plural}" (revision: ${version})...`,
      K8sCustomObjectService.name
    );

    try {
      const fieldSelector: string = name ? `metadata.name=${name}` : undefined;
      const resourceVersion: string = version ? version : undefined;

      const controller: AbortController = await this.k8sWatcher.watch(
        `/apis/${VELERO.GROUP}/${VELERO.VERSION}/namespaces/${this.configService.get('velero.namespace')}/${plural}`,
        { fieldSelector, resourceVersion },
        (phase: string, obj: KubernetesObject) => {
          this.logger.debug(
            `watch:${plural}${obj.metadata.name}:${phase}`,
            K8sCustomObjectService.name
          );
          client.emit(`watch:${plural}${name ? `:${name}` : ''}:${phase}`, obj);
        },
        () => void 0
      );

      this.activeWatchers.set(client.id, {
        name,
        controller,
      });
    } catch (error) {
      console.error('Error watch streaming:', error);
      this.activeWatchers.delete(client.id);
    }
  }

  public unWatch(client: Socket, name?: string) {
    for (const [key, { name: resourceName, controller }] of this
      .activeWatchers) {
      if (key === client.id && resourceName === name) {
        controller?.abort();
        this.activeWatchers.delete(key);
      }
    }
  }
}
