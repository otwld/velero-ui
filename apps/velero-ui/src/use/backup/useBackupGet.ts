import type { V1Backup } from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { Ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import { useBackupStore } from '../../stores/backup.store';
import {ToastType, useToastsStore} from "@velero-ui-app/stores/toasts.store";

export const useBackupGet = (name: Ref<string>) => {
  const toastsStore = useToastsStore();
  const backupStore = useBackupStore();

  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const { execute, isLoading, data } = useAxios<V1Backup>(axiosInstance);

  const isGetting = isLoading;

  const get = async () => {
    try {
      await execute(`${ApiRoutes.BACKUPS}/${name.value}`, {
        method: 'GET',
      });

      if (data?.value) {
        backupStore.set(data.value);
      }
    } catch (e) {
      toastsStore.push(
        'Unable to fetch backup\'s information, please try again.',
        ToastType.ERROR
      );
      console.error(e);
    }
  };

  return { get, isGetting };
};
