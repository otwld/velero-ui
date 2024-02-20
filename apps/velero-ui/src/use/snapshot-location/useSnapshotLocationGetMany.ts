import type { V1VolumeSnapshotLocationList } from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import { storeToRefs } from 'pinia';
import { useListStore } from '../../stores/list.store';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { useSnapshotLocationStore } from '@velero-ui-app/stores/snapshot-location.store';

export const useSnapshotLocationGetMany = () => {
  const snapshotLocationStore = useSnapshotLocationStore();
  const listStore = useListStore();
  const toastsStore = useToastsStore();
  const { offset, limit, filters } = storeToRefs(listStore);

  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const { execute, isLoading, data } =
    useAxios<V1VolumeSnapshotLocationList>(axiosInstance);

  const isGettingMany = isLoading;

  const getMany = async () => {
    try {
      await execute(`${ApiRoutes.SNAPSHOT_LOCATIONS}`, {
        method: 'GET',
        params: {
          offset: offset.value,
          limit: limit.value,
          search: filters.value.startWith,
        },
      });

      if (data?.value?.items) {
        snapshotLocationStore.setMany(data.value.items);
        listStore.setTotal(data.value.total);
      }
    } catch (e) {
      toastsStore.push(
        'Unable to fetch snapshot locations, please try again.',
        ToastType.ERROR
      );
      console.error(e);
    }
  };

  return { getMany, isGettingMany };
};
