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
import {
  KubernetesListObjectWithFilters,
  Search,
} from '@velero-ui/shared-types';
import { filters, slice, sort } from '@velero-ui-api/shared/utils/search.utils';
export const resourceApiVersion = (plural: string): string =>
  ['datauploads', 'datadownloads'].includes(plural)
    ? 'v2alpha1'
    : VELERO.VERSION;

export interface WatchClient {
  id: string;
  emit(event: string, ...args: unknown[]): unknown;
}

export interface KubernetesPageQuery {
  limit?: number;
  continue?: string;
  labelSelector?: string;
  fieldSelector?: string;
}

interface ResourceWatch {
  retryDelay?: number;
  labelSelector?: string;
  plural: string;
  name?: string;
  version?: string;
  controller?: AbortController;
  reconnect?: ReturnType<typeof setTimeout>;
}

@Injectable()
export class K8sCustomObjectService {
  private k8sCustomObjectApi: CustomObjectsApi;
  private k8sWatcher: Watch;

  private readonly activeWatchers = new Map<
    string,
    Map<string, ResourceWatch>
  >();

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
        version: resourceApiVersion(plural),
        namespace: this.configService.get('velero.namespace'),
        plural,
      })
    ).pipe(
      map((r: KubernetesListObject<T>): KubernetesListObjectWithFilters<T> =>
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

  /** Read one native Kubernetes chunk. Never follow continuation tokens here. */
  public getPage<T extends KubernetesObject>(
    plural: string,
    query: KubernetesPageQuery = {}
  ): Observable<KubernetesListObject<T>> {
    const limit =
      Number.isFinite(query.limit) && query.limit > 0
        ? Math.max(1, Math.min(100, Math.floor(query.limit)))
        : 20;
    return from(
      this.k8sCustomObjectApi.listNamespacedCustomObject({
        group: VELERO.GROUP,
        version: resourceApiVersion(plural),
        namespace: this.configService.get('velero.namespace'),
        plural,
        limit,
        _continue: query.continue,
        labelSelector: query.labelSelector,
        fieldSelector: query.fieldSelector,
      })
    ).pipe(
      map((list: KubernetesListObject<T>) => list),
      catchError((error: ApiException<T>) =>
        throwError(() => new HttpException(error.message, error.code || 500))
      )
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
        version: resourceApiVersion(plural),
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
        version: resourceApiVersion(plural),
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
        version: resourceApiVersion(plural),
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
          version: resourceApiVersion(plural),
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
            version: resourceApiVersion(plural),
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
        version: resourceApiVersion(plural),
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
    client: WatchClient,
    plural: string,
    name?: string,
    version?: string,
    labelSelector?: string
  ) {
    this.unWatch(client, name, plural);
    const subscriptions =
      this.activeWatchers.get(client.id) || new Map<string, ResourceWatch>();
    const subscription: ResourceWatch = {
      plural,
      name,
      version,
      labelSelector,
    };
    subscriptions.set(this.watchKey(plural, name), subscription);
    this.activeWatchers.set(client.id, subscriptions);
    await this.openWatch(client, subscription);
  }

  private watchKey(plural: string, name?: string) {
    return JSON.stringify([plural, name || null]);
  }

  private isActive(client: WatchClient, subscription: ResourceWatch) {
    return (
      this.activeWatchers
        .get(client.id)
        ?.get(this.watchKey(subscription.plural, subscription.name)) ===
      subscription
    );
  }

  private async openWatch(client: WatchClient, subscription: ResourceWatch) {
    if (!this.isActive(client, subscription)) return;
    const { plural, name } = subscription;
    const event = `watch:${plural}${name ? `:${name}` : ''}`;
    let ended = false;
    const done = (error?: { code?: number; statusCode?: number }) => {
      if (ended || !this.isActive(client, subscription)) return;
      ended = true;
      subscription.controller?.abort();
      subscription.controller = undefined;
      const code = error?.statusCode ?? error?.code;
      if (code >= 400 && code < 500 && code !== 408 && code !== 429) {
        this.unWatch(client, name, plural);
        client.emit(`${event}:ERROR`, { code });
        return;
      }
      // Reopen a closed stream from the latest observed revision, without HTTP polling.
      const delay = subscription.retryDelay || 1000;
      subscription.retryDelay = Math.min(delay * 2, 30000);
      subscription.reconnect = setTimeout(() => {
        subscription.reconnect = undefined;
        void this.openWatch(client, subscription);
      }, delay);
    };
    try {
      const controller = await this.k8sWatcher.watch(
        `/apis/${VELERO.GROUP}/${resourceApiVersion(plural)}/namespaces/${this.configService.get('velero.namespace')}/${plural}`,
        {
          fieldSelector: name ? `metadata.name=${name}` : undefined,
          resourceVersion: subscription.version,
          ...(subscription.labelSelector
            ? { labelSelector: subscription.labelSelector }
            : {}),
        },
        (phase: string, obj: KubernetesObject & { code?: number }) => {
          if (ended || !this.isActive(client, subscription)) return;
          if (phase === 'ERROR') {
            done({ code: obj.code });
            return;
          }
          if (['ADDED', 'MODIFIED', 'DELETED', 'BOOKMARK'].includes(phase))
            subscription.retryDelay = 1000;
          if (obj.metadata?.resourceVersion)
            subscription.version = obj.metadata.resourceVersion;
          if (['ADDED', 'MODIFIED', 'DELETED'].includes(phase)) {
            client.emit(`${event}:${phase}`, obj);
          }
        },
        done
      );
      if (!this.isActive(client, subscription) || ended) controller.abort();
      else subscription.controller = controller;
    } catch (error) {
      this.logger.error(
        `Watch stream failed for "${plural}"`,
        K8sCustomObjectService.name
      );
      done(error);
    }
  }

  public unWatch(client: WatchClient, name?: string, plural?: string) {
    const subscriptions = this.activeWatchers.get(client.id);
    if (!subscriptions) return;
    for (const [key, subscription] of subscriptions) {
      // No plural retains the legacy list/detail unsubscribe behavior.
      if (
        subscription.name === name &&
        (!plural || subscription.plural === plural)
      ) {
        subscriptions.delete(key);
        if (subscription.reconnect) clearTimeout(subscription.reconnect);
        subscription.controller?.abort();
      }
    }
    if (subscriptions.size === 0) this.activeWatchers.delete(client.id);
  }

  public unWatchAll(client: WatchClient) {
    const subscriptions = this.activeWatchers.get(client.id);
    this.activeWatchers.delete(client.id);
    subscriptions?.forEach((subscription) => {
      if (subscription.reconnect) clearTimeout(subscription.reconnect);
      subscription.controller?.abort();
    });
  }
}
