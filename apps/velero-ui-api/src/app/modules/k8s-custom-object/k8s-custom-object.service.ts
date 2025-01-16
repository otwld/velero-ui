import { Inject, Injectable } from '@nestjs/common';
import {
  CustomObjectsApi,
  KubeConfig,
  KubernetesEventType,
  KubernetesListObject,
  KubernetesObject,
  PatchUtils,
  Watch,
} from '@kubernetes/client-node';
import { K8S_CONNECTION } from '@velero-ui-api/shared/modules/k8s/k8s.constants';
import { VeleroService } from '@velero-ui-api/shared/modules/velero/velero.service';
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
import { IncomingMessage } from 'http';
import { sortObjects } from '@velero-ui-api/shared/utils/sorts.utils';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import { Socket } from 'socket.io';
import { KubernetesObjectWithSpec } from '@kubernetes/client-node/dist/types';

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
    private readonly veleroService: VeleroService,
    private configService: ConfigService,
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
    this.k8sWatcher = new Watch(this.k8s);
  }

  public get<R extends KubernetesObject, T extends KubernetesListObject<R>>(
    plural: string,
    offset = 0,
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
      .pipe(map((r: { response: IncomingMessage; body: T }): T => r.body))
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
    ).pipe(map((r: { response: IncomingMessage; body: T }): T => r.body));
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
        (r: { response: IncomingMessage; body: { items: [] } }): number =>
          r.body.items.length,
      ),
      catchError(() => of(0)),
    );
  }

  public create(
    plural: string,
    body: object,
  ): Observable<KubernetesObjectWithSpec> {
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
    ).pipe(
      map(
        (r: { response: IncomingMessage; body: KubernetesObjectWithSpec }) =>
          r.body,
      ),
      catchError((e: Error) => {
        this.logger.error(e.message, K8sCustomObjectService.name);
        return throwError(() => e);
      }),
      tap((body: KubernetesObjectWithSpec) =>
        this.logger.debug(
          `Creating resource ${body?.metadata?.name} in "${plural}"... SUCCESS`,
          K8sCustomObjectService.name,
        ),
      ),
    );
  }

  public edit(
    plural: string,
    name: string,
    body: object,
  ): Observable<KubernetesObjectWithSpec> {
    this.logger.debug(
      `Editing resource  ${name} in ${plural} ...`,
      K8sCustomObjectService.name,
    );

    const options = {
      headers: { 'Content-type': PatchUtils.PATCH_FORMAT_JSON_PATCH },
    };

    return from(
      this.k8sCustomObjectApi.patchNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        plural,
        name,
        body,
        undefined,
        undefined,
        undefined,
        options,
      ),
    ).pipe(
      map(
        (r: { response: IncomingMessage; body: KubernetesObjectWithSpec }) =>
          r.body,
      ),
      catchError((e: Error) => {
        this.logger.error(e.message, K8sCustomObjectService.name);
        return throwError(() => e);
      }),
      tap(() =>
        this.logger.debug(
          `Edited ${name} in ${plural}... SUCCESS`,
          K8sCustomObjectService.name,
        ),
      ),
    );
  }

  public delete(plural: string, names: string[]): Observable<void> {
    this.logger.debug(
      `Deleting resources ${names.join(',')} in "${plural}"...`,
      K8sCustomObjectService.name,
    );

    return from(names)
      .pipe(
        concatMap((name: string) =>
          this.k8sCustomObjectApi.deleteNamespacedCustomObject(
            VELERO.GROUP,
            VELERO.VERSION,
            this.configService.get('velero.namespace'),
            plural,
            name,
          ),
        ),
      )
      .pipe(
        catchError((e: Error) => {
          this.logger.error(e.message, K8sCustomObjectService.name);
          return throwError(() => e);
        }),
        tap(() =>
          this.logger.debug(
            `Deleting resources ${names.join(',')} in "${plural}"... SUCCESS`,
            K8sCustomObjectService.name,
          ),
        ),
        map(() => void 0),
      );
  }

  public deleteByName(plural: string, name: string): Observable<void> {
    this.logger.debug(
      `Deleting resource ${name} in "${plural}"...`,
      K8sCustomObjectService.name,
    );

    return from(
      this.k8sCustomObjectApi.deleteNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        plural,
        name,
      ),
    ).pipe(
      catchError((e: Error) => {
        this.logger.error(e.message, K8sCustomObjectService.name);
        return throwError(() => e);
      }),
      tap(() =>
        this.logger.debug(
          `Deleting resource ${name} in "${plural}"... SUCCESS`,
          K8sCustomObjectService.name,
        ),
      ),
      map(() => void 0),
    );
  }

  public async watch(
    client: Socket,
    plural: string,
    name?: string,
    version?: string,
  ) {
    if (this.activeWatchers.has(client.id)) {
      this.unWatch(client, name);
    }

    this.logger.debug(
      `Watching ${name ? name : 'resources'} in "${plural}" (revision: ${version})...`,
      K8sCustomObjectService.name,
    );

    const controller: AbortController = new AbortController();
    this.activeWatchers.set(client.id, {
      name,
      controller,
    });

    try {
      const fieldSelector: string = name ? `metadata.name=${name}` : undefined;
      const resourceVersion: string = version ? version : undefined;

      await this.k8sWatcher.watch(
        `/apis/${VELERO.GROUP}/${VELERO.VERSION}/namespaces/${this.configService.get('velero.namespace')}/${plural}`,
        { signal: controller.signal, fieldSelector, resourceVersion },
        (phase: KubernetesEventType, obj: KubernetesObject) => {
          this.logger.debug(
            `watch:${plural}${obj.metadata.name}:${phase}`,
            K8sCustomObjectService.name,
          );
          client.emit(`watch:${plural}${name ? `:${name}` : ''}:${phase}`, obj);
        },
        (err) => {
          if (!controller.signal.aborted) {
            console.error('Watch error:', err);
          }
        },
      );
    } catch (error) {
      console.error('Error watch streaming:', error);
      controller.abort();
      this.activeWatchers.delete(client.id);
    }
  }

  public unWatch(client: Socket, name?: string) {
    for (const [key, { name: resourceName, controller }] of this
      .activeWatchers) {
      if (key === client.id && resourceName === name) {
        controller.abort();
        this.activeWatchers.delete(key);
      }
    }
  }
}
