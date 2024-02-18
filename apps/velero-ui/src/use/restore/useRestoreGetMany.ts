import type { V1RestoreList } from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import { storeToRefs } from 'pinia';
import { useListStore } from '../../stores/list.store';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { useRestoreStore } from '@velero-ui-app/stores/restore.store';

export const useRestoreGetMany = () => {
  const restoreStore = useRestoreStore();
  const listStore = useListStore();
  const toastsStore = useToastsStore();
  const { offset, limit, filters } = storeToRefs(listStore);

  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const { execute, isLoading, data } = useAxios<V1RestoreList>(axiosInstance);

  const isGettingMany = isLoading;

  const getMany = async () => {
    try {
      await execute(`${ApiRoutes.RESTORES}`, {
        method: 'GET',
        params: {
          offset: offset.value,
          limit: limit.value,
          search: filters.value.startWith,
        },
      });

      if (data?.value?.items) {
        restoreStore.setMany(data.value.items);
        listStore.setTotal(data.value.total);
      }
    } catch (e) {
      toastsStore.push(
        'Unable to fetch restores, please try again.',
        ToastType.ERROR
      );
      console.error(e);
    }
  };

  return { getMany, isGettingMany };
};
