import type {V1Restore} from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { Ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { useRestoreStore } from '@velero-ui-app/stores/restore.store';

export const useRestoreGet = (name: Ref<string>) => {
  const toastsStore = useToastsStore();
  const restoreStore = useRestoreStore();

  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const { execute, isLoading, data } = useAxios<V1Restore>(axiosInstance);

  const isGetting = isLoading;

  const get = async () => {
    try {
      await execute(`${ApiRoutes.RESTORES}/${name.value}`, {
        method: 'GET',
      });

      if (data?.value) {
        restoreStore.set(data.value);
      }
    } catch (e) {
      toastsStore.push(
        "Unable to fetch restore's information, please try again.",
        ToastType.ERROR
      );
      console.error(e);
    }
  };

  return { get, isGetting };
};
