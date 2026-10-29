import { computed, inject, ref, watch, type Ref } from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import type { AxiosInstance } from 'axios';
import { Resources } from '@velero-ui/velero';
import {
  Action,
  type PodVolumeListItem,
  type PodVolumeListPage,
} from '@velero-ui/shared-types';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { can } from '@velero-ui-app/utils/policy.utils';
import type { SocketIO } from '@velero-ui-app/plugins/socket.plugin';

export interface ListQuery {
  data: Ref<PodVolumeListItem[]>;
  isFetching: Ref<boolean>;
  error: Ref<Error | null>;
  refetch: () => Promise<unknown>;
  on: () => void;
  off: () => void;
}

let sequence = 0;
export function usePodVolumeList(backup: boolean): ListQuery {
  const axios = inject('axios') as AxiosInstance;
  const socket = inject('socketIo') as SocketIO;
  const queryClient = useQueryClient();
  const store = useListStore();
  const { filters, sort, offset, limit } = storeToRefs(store);
  const permissions = [
    can(
      Action.Read,
      (backup ? Resources.POD_VOLUME_BACKUP : Resources.POD_VOLUME_RESTORE)
        .plural
    ),
    can(
      Action.Read,
      (backup ? Resources.DATA_UPLOAD : Resources.DATA_DOWNLOAD).plural
    ),
    !backup && can(Action.Read, Resources.RESTORE.plural),
  ];
  const allowed = permissions[0] || permissions[1];
  const route = `/pod-volumes/${backup ? 'backups' : 'restores'}`;
  const search = computed(() => ({
    ...filters.value,
    ...sort.value,
    offset: offset.value,
    limit: Math.max(1, Math.min(100, limit.value || 20)),
  }));
  const keyFor = (params: typeof search.value) => [
    'pod-volume-menu',
    route,
    permissions,
    params,
  ];
  const queryKey = computed(() => keyFor(search.value));
  const identity = computed(() => JSON.stringify(search.value));
  let active = false;
  let disposed = false;
  let connected = true;
  let requestId: string | undefined;
  let subscribedIdentity: string | undefined;
  const streamError = ref<Error | null>(null);
  const query = useQuery({
    queryKey,
    enabled: allowed,
    queryFn: async ({ signal }) => {
      const response = await axios.get<PodVolumeListPage>(route, {
        params: { ...search.value },
        signal,
      });
      return response.data;
    },
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
  const synchronizeStore = (page: PodVolumeListPage) => {
    if (limit.value !== page.limit) store.setLimit(page.limit);
    store.setTotal(page.total);
    store.setAvailableFilters(page.filters);
    if (page.offset !== offset.value) {
      // Seed the clamped page before moving the cursor, avoiding another HTTP request.
      queryClient.setQueryData(
        keyFor({ ...search.value, offset: page.offset }),
        page
      );
      offset.value = page.offset;
    }
  };
  const start = () => {
    if (
      !active ||
      disposed ||
      !connected ||
      !allowed ||
      query.isFetching.value ||
      !query.data.value ||
      query.isError.value
    )
      return;
    if (subscribedIdentity === identity.value) return;
    subscribedIdentity = identity.value;
    requestId = `pod-volumes-${++sequence}`;
    streamError.value = null;
    socket.io.emit('pod-volumes:watch', {
      backup,
      search: { ...search.value },
      requestId,
    });
  };
  const matches = (message: { backup: boolean; requestId: string }) =>
    active &&
    !disposed &&
    connected &&
    message.backup === backup &&
    message.requestId === requestId &&
    subscribedIdentity === identity.value;
  const receive = (message: {
    backup: boolean;
    requestId: string;
    page: PodVolumeListPage;
  }) => {
    if (!matches(message)) return;
    queryClient.setQueryData(queryKey.value, message.page);
    synchronizeStore(message.page);
  };
  const failed = (message: {
    backup: boolean;
    requestId: string;
    code: number;
  }) => {
    if (matches(message))
      streamError.value = new Error(
        `Pod volume subscription failed (${message.code})`
      );
  };
  const refetch = async () => {
    if (disposed || !allowed) return;
    requestId = undefined;
    subscribedIdentity = undefined;
    socket.io.emit('pod-volumes:unwatch', { backup });
    await query.refetch();
    start();
  };
  const reconnect = () => {
    connected = true;
    if (active) void refetch();
  };
  const disconnect = () => {
    connected = false;
    requestId = undefined;
    subscribedIdentity = undefined;
  };
  const listeners = [
    ['pod-volumes:page', receive],
    ['pod-volumes:error', failed],
    ['connect', reconnect],
    ['disconnect', disconnect],
  ] as const;
  const on = () => {
    if (active || disposed) return;
    active = true;
    listeners.forEach(([event, handler]) => socket.io.on(event, handler));
    start();
  };
  const off = () => {
    if (disposed) return;
    active = false;
    disposed = true;
    requestId = undefined;
    listeners.forEach(([event, handler]) => socket.io.off(event, handler));
    if (allowed) socket.io.emit('pod-volumes:unwatch', { backup });
    void queryClient.cancelQueries({ queryKey: queryKey.value, exact: true });
  };
  watch(
    query.data,
    (page) => {
      if (page && !disposed) synchronizeStore(page);
    },
    { immediate: true }
  );
  // Wait for the HTTP snapshot to enter the cache before accepting immediate socket events.
  watch([query.isFetching, identity, query.dataUpdatedAt], start, {
    flush: 'post',
  });
  return {
    data: computed(() => (allowed ? query.data.value?.items || [] : [])),
    isFetching: computed(() => query.isFetching.value),
    error: computed(
      () =>
        query.error.value ||
        streamError.value ||
        (query.data.value?.issues.length
          ? new Error('Some pod volume sources are unavailable')
          : null)
    ),
    refetch,
    on,
    off,
  };
}
