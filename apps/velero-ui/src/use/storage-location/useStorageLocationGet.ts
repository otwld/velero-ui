import type {V1BackupStorageLocation} from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { Ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { useStorageLocationStore } from '@velero-ui-app/stores/storage-location.store';

export const useStorageLocationGet = (name: Ref<string>) => {
  const toastsStore = useToastsStore();
  const storageLocationStore = useStorageLocationStore();

  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const { execute, isLoading, data } =
    useAxios<V1BackupStorageLocation>(axiosInstance);

  const isGetting = isLoading;

  const get = async () => {
    try {
      await execute(`${ApiRoutes.STORAGE_LOCATIONS}/${name.value}`, {
        method: 'GET',
      });

      if (data?.value) {
        storageLocationStore.set(data.value);
      }
    } catch (e) {
      toastsStore.push(
        "Unable to fetch storage location's information, please try again.",
        ToastType.ERROR
      );
      console.error(e);
    }
  };

  return { get, isGetting };
};
