import {
  computed,
  inject,
  onBeforeMount,
  onBeforeUnmount,
  ref,
  watch,
  type Ref,
} from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { isAxiosError, type AxiosInstance } from 'axios';
import type { Resource } from '@velero-ui/velero';
import type { KubernetesListObject } from '@kubernetes/client-node';
import type { SocketIO } from '@velero-ui-app/plugins/socket.plugin';
import {
  belongsToParent,
  type VolumeOperation,
} from '@velero-ui-app/utils/volume.utils';

const isTransient = (error: unknown) =>
  isAxiosError(error) &&
  (!error.response ||
    error.response.status === 408 ||
    error.response.status === 429 ||
    error.response.status >= 500);

let sequence = 0;
/** Detail queries and watches are scoped to one parent, independently of list state. */
export function useVolumeOperations<T extends VolumeOperation>(
  resource: Resource,
  name: Ref<string>,
  backup: boolean,
  allowed: boolean,
  uid?: Ref<string | undefined>
) {
  const axios = inject('axios') as AxiosInstance;
  const socket = inject('socketIo') as SocketIO;
  const queryClient = useQueryClient();
  const identity = computed(() => JSON.stringify([name.value, uid?.value]));
  const queryKey = computed(() => [
    'volume-operations',
    resource.plural,
    name.value,
    uid?.value,
  ]);
  const streamError = ref<Error | null>(null);
  let active = false;
  let disposed = false;
  let connected = true;
  let available = false;
  let version: string | undefined;
  let requestId: string | undefined;
  let subscribedIdentity: string | undefined;
  const optional = ['datauploads', 'datadownloads'].includes(resource.plural);
  const stop = () => {
    if (requestId) socket.io.emit('volume-operations:unwatch', { requestId });
    requestId = undefined;
    subscribedIdentity = undefined;
  };
  const query = useQuery({
    queryKey,
    enabled: allowed,
    queryFn: async ({ signal }): Promise<T[]> => {
      stop();
      available = false;
      const parent = name.value;
      const parentUid = uid?.value;
      try {
        const response = await axios.get<KubernetesListObject<T>>(
          `/pod-volumes/operations/${resource.plural}/${encodeURIComponent(parent)}`,
          { params: { uid: parentUid }, signal }
        );
        if (disposed || signal.aborted) return [];
        available = true;
        version = response.data.metadata?.resourceVersion;
        streamError.value = null;
        return response.data.items.filter((item) =>
          belongsToParent(item, parent, backup, parentUid)
        );
      } catch (error) {
        const current =
          !disposed &&
          !signal.aborted &&
          name.value === parent &&
          uid?.value === parentUid;
        if (optional && isAxiosError(error) && error.response?.status === 404) {
          if (current) streamError.value = null;
          return [];
        }
        if (current && isTransient(error)) streamError.value = error as Error;
        throw error;
      }
    },
    // TanStack cancels this retry sequence when the parent changes or the
    // last observer unmounts, because the query consumes its AbortSignal.
    retry: (_count, error) => !disposed && allowed && isTransient(error),
    retryDelay: (count) => Math.min(30000, 1000 * 2 ** Math.min(count, 5)),
    initialData: () => [] as T[],
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const start = () => {
    if (
      !active ||
      disposed ||
      !connected ||
      !allowed ||
      !available ||
      query.isFetching.value ||
      query.isError.value ||
      subscribedIdentity === identity.value
    )
      return;
    subscribedIdentity = identity.value;
    requestId = `volume-operations-${++sequence}`;
    socket.io.emit('volume-operations:watch', {
      plural: resource.plural,
      parent: name.value,
      uid: uid?.value,
      version,
      requestId,
    });
  };
  const refetch = async () => {
    if (disposed || !allowed) return;
    stop();
    await query.refetch();
    start();
  };
  const receive = (event: {
    requestId: string;
    phase: string;
    object?: T;
    code?: number;
  }) => {
    if (
      !active ||
      disposed ||
      !connected ||
      event.requestId !== requestId ||
      subscribedIdentity !== identity.value
    )
      return;
    if (event.phase === 'ERROR') {
      stop();
      if (event.code === 410) void refetch();
      else if (!(optional && event.code === 404))
        streamError.value = new Error(
          `Volume operation watch failed (${event.code})`
        );
      return;
    }
    const object = event.object;
    if (
      !object?.metadata?.name ||
      !belongsToParent(object, name.value, backup, uid?.value)
    )
      return;
    if (!['ADDED', 'MODIFIED', 'DELETED'].includes(event.phase)) return;
    queryClient.setQueryData<T[]>(queryKey.value, (items = []) => {
      const sameName = (item: T) =>
        item.metadata?.name === object.metadata.name &&
        item.metadata?.namespace === object.metadata.namespace;
      if (event.phase === 'DELETED')
        return items.filter(
          (item) =>
            !sameName(item) ||
            !object.metadata.uid ||
            item.metadata.uid !== object.metadata.uid
        );
      return items.some(sameName)
        ? items.map((item) => (sameName(item) ? object : item))
        : [...items, object];
    });
  };
  const disconnect = () => {
    connected = false;
    requestId = undefined;
    subscribedIdentity = undefined;
  };
  const reconnect = () => {
    connected = true;
    if (active) void refetch();
  };
  const listeners = [
    ['volume-operations:event', receive],
    ['disconnect', disconnect],
    ['connect', reconnect],
  ] as const;
  onBeforeMount(() => {
    active = true;
    listeners.forEach(([event, handler]) => socket.io.on(event, handler));
    start();
  });
  onBeforeUnmount(() => {
    active = false;
    disposed = true;
    stop();
    listeners.forEach(([event, handler]) => socket.io.off(event, handler));
    void queryClient.cancelQueries({ queryKey: queryKey.value, exact: true });
  });
  watch(
    identity,
    () => {
      stop();
      streamError.value = null;
    },
    { flush: 'sync' }
  );
  // Commit the HTTP snapshot before a synchronous socket callback can update the cache.
  watch([query.isFetching, query.dataUpdatedAt], start, { flush: 'post' });
  return {
    ...query,
    data: computed(() => (allowed ? query.data.value : ([] as T[]))),
    error: computed(() => query.error.value || streamError.value),
    refetch,
  };
}
