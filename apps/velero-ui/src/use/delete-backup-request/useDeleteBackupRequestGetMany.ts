import type { V1DeleteBackupRequestList } from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject, ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import { storeToRefs } from 'pinia';
import { useListStore } from '../../stores/list.store';
import {ToastType, useToastsStore} from "@velero-ui-app/stores/toasts.store";

export const useDeleteBackupRequestGetMany = () => {
  const listStore = useListStore();
  const toastsStore = useToastsStore();
  const { offset, limit, filters } = storeToRefs(listStore);

  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const { execute, isLoading, data } =
    useAxios<V1DeleteBackupRequestList>(axiosInstance);

  const isGettingMany = isLoading;
  const deleteBackupRequests = ref([]);

  const getMany = async () => {
    try {
      await execute(`${ApiRoutes.DELETE_BACKUP_REQUESTS}`, {
        method: 'GET',
        params: {
          offset: offset.value,
          limit: limit.value,
          search: filters.value.startWith,
        },
      });

      if (data?.value?.items) {
        deleteBackupRequests.value = data?.value?.items;
        listStore.setTotal(data.value.total);
      }
    } catch (e) {
       toastsStore.push(
        'Unable to fetch delete backup requests, please try again.',
        ToastType.ERROR
      );
      console.error(e);
    }
  };

  return { getMany, isGettingMany, deleteBackupRequests };
};
