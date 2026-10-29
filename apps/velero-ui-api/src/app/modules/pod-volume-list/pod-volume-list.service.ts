import {
  Injectable,
  OnModuleDestroy,
  ForbiddenException,
} from '@nestjs/common';
import type { KubernetesObject } from '@kubernetes/client-node';
import { firstValueFrom } from 'rxjs';
import { Resources, type V1Restore } from '@velero-ui/velero';
import {
  filterPodVolumeList,
  podVolumeListItem,
  type PodVolumeListPage,
  type PodVolumeListPermissions,
  type Search,
  type VolumeOperation,
} from '@velero-ui/shared-types';
import {
  K8sCustomObjectService,
  type WatchClient,
} from '../k8s-custom-object/k8s-custom-object.service';

interface Source {
  plural: string;
  items: Map<string, KubernetesObject>;
  client: WatchClient;
  users: Set<Subscription>;
  loading?: Promise<void>;
  error?: number;
  expiry?: ReturnType<typeof setTimeout>;
  retry?: ReturnType<typeof setTimeout>;
  retryAttempts?: number;
}
interface Subscription {
  client: WatchClient;
  backup: boolean;
  search: Search;
  requestId: string;
  sources: Source[];
  permissions: PodVolumeListPermissions;
  ready: boolean;
  timer?: ReturnType<typeof setTimeout>;
}
const identity = (item: KubernetesObject) =>
  JSON.stringify([item.metadata?.namespace || '', item.metadata?.name]);
const status = (error: unknown) => {
  const value = error as {
    getStatus?: () => number;
    code?: number;
    status?: number;
  };
  return value?.getStatus?.() || value?.code || value?.status || 500;
};

/** One cluster snapshot/watch per source; browsers receive only bounded pages. */
@Injectable()
export class PodVolumeListService implements OnModuleDestroy {
  private readonly sources = new Map<string, Source>();
  private readonly subscriptions = new Map<string, Subscription>();
  private destroyed = false;
  constructor(private readonly objects: K8sCustomObjectService) {}

  private resources(backup: boolean, permissions: PodVolumeListPermissions) {
    if (!permissions.filesystem && !permissions.mover)
      throw new ForbiddenException();
    return [
      ...(permissions.filesystem
        ? [
            backup
              ? Resources.POD_VOLUME_BACKUP.plural
              : Resources.POD_VOLUME_RESTORE.plural,
          ]
        : []),
      ...(permissions.mover
        ? [
            backup
              ? Resources.DATA_UPLOAD.plural
              : Resources.DATA_DOWNLOAD.plural,
          ]
        : []),
      ...(!backup && permissions.restores ? [Resources.RESTORE.plural] : []),
    ];
  }
  private source(plural: string): Source {
    let source = this.sources.get(plural);
    if (!source) {
      source = {
        plural,
        items: new Map(),
        users: new Set(),
        client: {
          id: `pod-volume-cache:${plural}`,
          emit: (event, object) => this.event(source, event, object),
        },
      };
      this.sources.set(plural, source);
      source.loading = this.load(source);
    }
    if (source.error && !source.loading) source.loading = this.load(source);
    if (source.expiry) {
      clearTimeout(source.expiry);
      source.expiry = undefined;
    }
    return source;
  }
  private async load(source: Source): Promise<void> {
    this.cancelRetry(source);
    try {
      const list = await firstValueFrom(
        this.objects.get<KubernetesObject>(source.plural, { limit: 0 })
      );
      if (this.sources.get(source.plural) !== source || this.destroyed) return;
      source.items = new Map(list.items.map((item) => [identity(item), item]));
      source.error = undefined;
      source.retryAttempts = 0;
      await this.objects.watch(
        source.client,
        source.plural,
        undefined,
        list.metadata?.resourceVersion
      );
    } catch (error) {
      if (this.sources.get(source.plural) === source) {
        source.error = status(error);
        if ([403, 404].includes(source.error)) source.items.clear();
      }
    } finally {
      source.loading = undefined;
      this.scheduleRetry(source);
      this.notify(source);
      this.release(source);
    }
  }
  private cancelRetry(source: Source) {
    if (source.retry) clearTimeout(source.retry);
    source.retry = undefined;
  }
  private scheduleRetry(source: Source) {
    if (
      this.destroyed ||
      this.sources.get(source.plural) !== source ||
      !source.users.size ||
      source.retry ||
      source.loading ||
      !(source.error === 408 || source.error === 429 || source.error >= 500)
    )
      return;
    // Retry only failed snapshots while a browser needs this source. Healthy
    // sources continue exclusively through their Kubernetes watch.
    const delay = Math.min(
      30000,
      1000 * 2 ** Math.min(source.retryAttempts || 0, 5)
    );
    source.retryAttempts = (source.retryAttempts || 0) + 1;
    source.retry = setTimeout(() => {
      source.retry = undefined;
      if (
        this.destroyed ||
        this.sources.get(source.plural) !== source ||
        !source.users.size ||
        source.loading
      )
        return;
      source.loading = this.load(source);
    }, delay);
  }
  private event(source: Source, event: string, object: unknown) {
    if (this.sources.get(source.plural) !== source || this.destroyed) return;
    const phase = event.split(':').pop();
    if (phase === 'ERROR') {
      const code = status(object);
      source.error = code;
      if ([403, 404].includes(code)) source.items.clear();
      if (code === 410) {
        const previous = source.loading || Promise.resolve();
        void previous.then(() => {
          if (
            this.sources.get(source.plural) !== source ||
            source.loading ||
            this.destroyed
          )
            return;
          source.loading = this.load(source);
        });
      }
    } else if (['ADDED', 'MODIFIED', 'DELETED'].includes(phase)) {
      const item = object as KubernetesObject;
      if (!item?.metadata?.name) return;
      const key = identity(item);
      if (phase === 'DELETED') {
        if (
          item.metadata.uid &&
          source.items.get(key)?.metadata?.uid === item.metadata.uid
        )
          source.items.delete(key);
      } else source.items.set(key, item);
    }
    this.notify(source);
  }
  private notify(source: Source) {
    source.users.forEach((subscription) => {
      if (!subscription.ready || subscription.timer) return;
      subscription.timer = setTimeout(() => {
        subscription.timer = undefined;
        this.emit(subscription);
      }, 50);
    });
  }
  private key(client: WatchClient, backup: boolean) {
    return JSON.stringify([client.id, backup]);
  }
  private emit(subscription: Subscription) {
    if (
      this.subscriptions.get(
        this.key(subscription.client, subscription.backup)
      ) !== subscription
    )
      return;
    subscription.client.emit('pod-volumes:page', {
      backup: subscription.backup,
      requestId: subscription.requestId,
      page: this.page(
        subscription.backup,
        subscription.search,
        subscription.permissions,
        subscription.sources
      ),
    });
  }
  private page(
    backup: boolean,
    search: Search,
    permissions: PodVolumeListPermissions,
    sources: Source[]
  ): PodVolumeListPage {
    const rows = (plural: string) =>
      sources.find((source) => source.plural === plural)?.items.values() || [];
    const parents =
      permissions.restores && !backup
        ? ([...rows('restores')] as V1Restore[])
        : [];
    const parentsByUID = new Map(
      parents.map((item) => [item.metadata?.uid, item])
    );
    const parentsByName = new Map(
      parents.map((item) => [item.metadata?.name, item])
    );
    const filesystem = backup
      ? Resources.POD_VOLUME_BACKUP
      : Resources.POD_VOLUME_RESTORE;
    const mover = backup ? Resources.DATA_UPLOAD : Resources.DATA_DOWNLOAD;
    const items = [filesystem, mover].flatMap((resource) =>
      [...rows(resource.plural)].map((item) => {
        const uid = item.metadata?.labels?.['velero.io/restore-uid'];
        const name =
          item.metadata?.ownerReferences?.find(
            (owner) => owner.kind === 'Restore'
          )?.name || item.metadata?.labels?.['velero.io/restore-name'];
        const parent = uid ? parentsByUID.get(uid) : parentsByName.get(name);
        return podVolumeListItem(
          item as VolumeOperation,
          resource,
          parent ? [parent] : []
        );
      })
    );
    const limit = Number.isFinite(search.limit)
      ? Math.max(1, Math.min(100, Math.floor(search.limit)))
      : 20;
    const requestedOffset = Number.isFinite(search.offset)
      ? Math.max(0, Math.floor(search.offset))
      : 0;
    let result = filterPodVolumeList(items, {
      ...search,
      limit,
      offset: requestedOffset,
    });
    const offset = Math.min(
      requestedOffset,
      Math.max(0, Math.floor((result.total - 1) / limit) * limit)
    );
    if (offset !== requestedOffset)
      result = filterPodVolumeList(items, { ...search, limit, offset });
    return {
      ...result,
      offset,
      limit,
      issues: sources
        .filter(
          (source) =>
            source.error &&
            !(
              source.error === 404 &&
              ['datauploads', 'datadownloads'].includes(source.plural)
            )
        )
        .map((source) => ({ plural: source.plural })),
    };
  }
  async get(
    backup: boolean,
    search: Search,
    permissions: PodVolumeListPermissions
  ): Promise<PodVolumeListPage> {
    const sources = this.resources(backup, permissions).map((plural) =>
      this.source(plural)
    );
    try {
      await Promise.all(sources.map((source) => source.loading));
      return this.page(backup, search, permissions, sources);
    } finally {
      sources.forEach((source) => this.release(source));
    }
  }
  async subscribe(
    client: WatchClient,
    backup: boolean,
    search: Search,
    permissions: PodVolumeListPermissions,
    requestId: string
  ) {
    this.unsubscribe(client, backup);
    const plurals = this.resources(backup, permissions);
    const sources = plurals.map((plural) => this.source(plural));
    const subscription: Subscription = {
      client,
      backup,
      search,
      permissions,
      requestId,
      sources,
      ready: false,
    };
    this.subscriptions.set(this.key(client, backup), subscription);
    sources.forEach((source) => source.users.add(subscription));
    await Promise.all(sources.map((source) => source.loading));
    subscription.ready = true;
    this.emit(subscription);
  }
  unsubscribe(client: WatchClient, backup: boolean) {
    const key = this.key(client, backup);
    const subscription = this.subscriptions.get(key);
    if (!subscription) return;
    this.subscriptions.delete(key);
    if (subscription.timer) clearTimeout(subscription.timer);
    subscription.sources.forEach((source) => {
      source.users.delete(subscription);
      this.release(source);
    });
  }
  disconnect(client: WatchClient) {
    this.unsubscribe(client, true);
    this.unsubscribe(client, false);
  }
  private release(source: Source) {
    if (!source.users.size) this.cancelRetry(source);
    if (
      source.users.size ||
      source.expiry ||
      this.sources.get(source.plural) !== source
    )
      return;
    source.expiry = setTimeout(() => {
      this.sources.delete(source.plural);
      this.objects.unWatch(source.client, undefined, source.plural);
      source.items.clear();
    }, 30000);
  }
  onModuleDestroy() {
    this.destroyed = true;
    this.subscriptions.forEach((subscription) => {
      if (subscription.timer) clearTimeout(subscription.timer);
    });
    this.subscriptions.clear();
    this.sources.forEach((source) => {
      this.cancelRetry(source);
      if (source.expiry) clearTimeout(source.expiry);
      this.objects.unWatch(source.client, undefined, source.plural);
    });
    this.sources.clear();
  }
}
