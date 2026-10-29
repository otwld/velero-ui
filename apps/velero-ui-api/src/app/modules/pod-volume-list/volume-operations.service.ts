import { BadRequestException, Injectable } from '@nestjs/common';
import type { KubernetesListObject } from '@kubernetes/client-node';
import type { VolumeOperation } from '@velero-ui/shared-types';
import { createHash } from 'node:crypto';
import { lastValueFrom } from 'rxjs';
import {
  K8sCustomObjectService,
  type WatchClient,
} from '../k8s-custom-object/k8s-custom-object.service';
import {
  operationPlurals,
  VolumeOperationsWatchDto,
} from './volume-operations.dto';

@Injectable()
export class VolumeOperationsService {
  private readonly subscriptions = new Map<string, Map<string, WatchClient>>();
  constructor(private readonly objects: K8sCustomObjectService) {}
  private selector(plural: string, parent: string) {
    if (!operationPlurals.includes(plural as (typeof operationPlurals)[number]))
      throw new BadRequestException();
    const backup = ['podvolumebackups', 'datauploads'].includes(plural);
    const label =
      parent.length <= 63
        ? parent
        : parent.slice(0, 57) +
          createHash('sha256').update(parent).digest('hex').slice(0, 6);
    return `velero.io/${backup ? 'backup' : 'restore'}-name=${label}`;
  }
  private belongs(
    item: VolumeOperation,
    plural: string,
    parent: string,
    uid?: string
  ) {
    const backup = ['podvolumebackups', 'datauploads'].includes(plural);
    const labelUid =
      item.metadata?.labels?.[`velero.io/${backup ? 'backup' : 'restore'}-uid`];
    if (uid && labelUid) return uid === labelUid;
    const owner = item.metadata?.ownerReferences?.find(
      (ref) => ref.kind === (backup ? 'Backup' : 'Restore')
    );
    return !owner || (owner.name === parent && (!uid || owner.uid === uid));
  }
  async get(
    plural: string,
    parent: string,
    uid?: string
  ): Promise<KubernetesListObject<VolumeOperation>> {
    const labelSelector = this.selector(plural, parent);
    const items: VolumeOperation[] = [];
    let cursor: string | undefined;
    let metadata: KubernetesListObject<VolumeOperation>['metadata'];
    do {
      const page = await lastValueFrom(
        this.objects.getPage<VolumeOperation>(plural, {
          limit: 100,
          labelSelector,
          continue: cursor,
        })
      );
      items.push(
        ...page.items.filter((item) => this.belongs(item, plural, parent, uid))
      );
      metadata = page.metadata;
      cursor =
        (page.metadata as typeof page.metadata & { continue?: string })
          ?.continue || page.metadata?._continue;
    } while (cursor);
    return { items, metadata: { resourceVersion: metadata?.resourceVersion } };
  }
  async subscribe(client: WatchClient, body: VolumeOperationsWatchDto) {
    const selector = this.selector(body.plural, body.parent);
    this.unsubscribe(client, body.requestId);
    const sessions =
      this.subscriptions.get(client.id) || new Map<string, WatchClient>();
    const adapter: WatchClient = {
      id: `volume-operations:${JSON.stringify([client.id, body.requestId])}`,
      emit: (event, object: VolumeOperation & { code?: number }) => {
        if (this.subscriptions.get(client.id)?.get(body.requestId) !== adapter)
          return;
        const phase = event.slice(event.lastIndexOf(':') + 1);
        if (phase === 'ERROR')
          client.emit('volume-operations:event', {
            requestId: body.requestId,
            phase,
            code: object?.code || 500,
          });
        else if (
          ['ADDED', 'MODIFIED', 'DELETED'].includes(phase) &&
          this.belongs(object, body.plural, body.parent, body.uid)
        )
          client.emit('volume-operations:event', {
            requestId: body.requestId,
            phase,
            object,
          });
      },
    };
    sessions.set(body.requestId, adapter);
    this.subscriptions.set(client.id, sessions);
    await this.objects.watch(
      adapter,
      body.plural,
      undefined,
      body.version,
      selector
    );
  }
  unsubscribe(client: WatchClient, requestId: string) {
    const sessions = this.subscriptions.get(client.id);
    const adapter = sessions?.get(requestId);
    sessions?.delete(requestId);
    if (!sessions?.size) this.subscriptions.delete(client.id);
    if (adapter) this.objects.unWatchAll(adapter);
  }
  disconnect(client: WatchClient) {
    for (const id of [...(this.subscriptions.get(client.id)?.keys() || [])])
      this.unsubscribe(client, id);
  }
}
