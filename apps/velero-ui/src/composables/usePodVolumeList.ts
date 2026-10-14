import { computed, inject, watch } from 'vue';
import type { Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { isAxiosError, type AxiosInstance } from 'axios';
import { Resources, type Resource, type V1Restore } from '@velero-ui/velero';
import {
  Action,
  type KubernetesListObjectWithFilters,
} from '@velero-ui/shared-types';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { can } from '@velero-ui-app/utils/policy.utils';
import {
  filterPodVolumeList,
  podVolumeListItem,
  type PodVolumeListItem,
} from '@velero-ui-app/utils/pod-volume-list.utils';
import type { VolumeOperation } from '@velero-ui-app/utils/volume.utils';

export interface ListQuery {
  data: Ref<PodVolumeListItem[]>;
  isFetching: Ref<boolean>;
  error: Ref<Error | null>;
  refetch: () => Promise<unknown>;
  on: () => void;
  off: () => void;
}

export function usePodVolumeList(backup: boolean): ListQuery {
  const axios = inject('axios') as AxiosInstance;
  const store = useListStore();
  const { filters, sort, offset, limit } = storeToRefs(store);
  const filesystem = backup
    ? Resources.POD_VOLUME_BACKUP
    : Resources.POD_VOLUME_RESTORE;
  const mover = backup ? Resources.DATA_UPLOAD : Resources.DATA_DOWNLOAD;
  const readFilesystem = can(Action.Read, filesystem.plural);
  const readMover = can(Action.Read, mover.plural);
  const read = (resource: Resource, allowed: boolean) =>
    useQuery({
      queryKey: ['pod-volume-menu', resource.plural],
      enabled: allowed,
      queryFn: async (): Promise<VolumeOperation[]> => {
        try {
          return (
            await axios.get<KubernetesListObjectWithFilters<VolumeOperation>>(
              resource.route,
              { params: { limit: 0 } }
            )
          ).data.items;
        } catch (error) {
          if (
            isAxiosError(error) &&
            error.response?.status === 404 &&
            resource === mover
          )
            return [];
          throw error;
        }
      },
      initialData: () => [],
      refetchInterval: 5000,
      refetchOnWindowFocus: false,
      retry: 1,
    });
  const filesystemQuery = read(filesystem, readFilesystem);
  const moverQuery = read(mover, readMover);
  const readRestores = !backup && can(Action.Read, Resources.RESTORE.plural);
  const restores = useQuery({
    queryKey: ['pod-volume-menu', 'restore-parents'],
    enabled: readRestores,
    queryFn: async () =>
      (
        await axios.get<KubernetesListObjectWithFilters<V1Restore>>(
          Resources.RESTORE.route,
          { params: { limit: 0 } }
        )
      ).data.items,
    initialData: () => [] as V1Restore[],
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const result = computed(() =>
    filterPodVolumeList(
      [
        ...(readFilesystem ? filesystemQuery.data.value : []).map((item) =>
          podVolumeListItem(
            item,
            filesystem,
            readRestores ? restores.data.value : []
          )
        ),
        ...(readMover ? moverQuery.data.value : []).map((item) =>
          podVolumeListItem(
            item,
            mover,
            readRestores ? restores.data.value : []
          )
        ),
      ],
      {
        ...filters.value,
        ...sort.value,
        offset: offset.value,
        limit: limit.value,
      }
    )
  );
  watch(
    result,
    (value) => {
      store.setTotal(value.total);
      store.setAvailableFilters(value.filters);
    },
    { immediate: true }
  );
  return {
    data: computed(() => result.value.items),
    isFetching: computed(
      () =>
        filesystemQuery.isFetching.value ||
        moverQuery.isFetching.value ||
        restores.isFetching.value
    ),
    error: computed(
      () =>
        filesystemQuery.error.value ||
        moverQuery.error.value ||
        restores.error.value
    ),
    refetch: async () =>
      Promise.all([
        readFilesystem ? filesystemQuery.refetch() : Promise.resolve(),
        readMover ? moverQuery.refetch() : Promise.resolve(),
        readRestores ? restores.refetch() : Promise.resolve(),
      ]),
    on: () => undefined,
    off: () => undefined,
  };
}
