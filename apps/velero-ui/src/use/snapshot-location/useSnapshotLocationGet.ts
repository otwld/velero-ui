import type { V1VolumeSnapshotLocation } from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { Ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { useSnapshotLocationStore } from '@velero-ui-app/stores/snapshot-location.store';

export const useSnapshotLocationGet = (name: Ref<string>) => {
  const toastsStore = useToastsStore();
  const snapshotLocationStore = useSnapshotLocationStore();

  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const { execute, isLoading, data } =
    useAxios<V1VolumeSnapshotLocation>(axiosInstance);

  const isGetting = isLoading;

  const get = async () => {
    try {
      await execute(`${ApiRoutes.SNAPSHOT_LOCATIONS}/${name.value}`, {
        method: 'GET',
      });

      if (data?.value) {
        snapshotLocationStore.set(data.value);
      }
    } catch (e) {
      toastsStore.push(
        "Unable to fetch snapshot location's information, please try again.",
        ToastType.ERROR
      );
      console.error(e);
    }
  };

  return { get, isGetting };
};
