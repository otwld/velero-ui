import type { V1DownloadRequestList } from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject, ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import { storeToRefs } from 'pinia';
import { useListStore } from '../../stores/list.store';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';

export const useDownloadRequestGetMany = () => {
  const listStore = useListStore();
  const toastsStore = useToastsStore();
  const { offset, limit, filters } = storeToRefs(listStore);

  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const { execute, isLoading, data } =
    useAxios<V1DownloadRequestList>(axiosInstance);

  const isGettingMany = isLoading;
  const downloadRequests = ref([]);

  const getMany = async () => {
    try {
      await execute(`${ApiRoutes.DOWNLOAD_REQUESTS}`, {
        method: 'GET',
        params: {
          offset: offset.value,
          limit: limit.value,
          search: filters.value.startWith,
        },
      });

      if (data?.value?.items) {
        downloadRequests.value = data?.value?.items;
        listStore.setTotal(data.value.total);
      }
    } catch (e) {
      toastsStore.push(
        'Unable to fetch download requests, please try again.',
        ToastType.ERROR
      );
      console.error(e);
    }
  };

  return { getMany, isGettingMany, downloadRequests };
};
