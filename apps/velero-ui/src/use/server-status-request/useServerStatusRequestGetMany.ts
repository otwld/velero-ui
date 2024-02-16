import type { V1ServerStatusRequestList } from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject, ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import { storeToRefs } from 'pinia';
import { useListStore } from '../../stores/list.store';

export const useServerStatusRequestGetMany = () => {
  const listStore = useListStore();
  const { offset, limit, filters } = storeToRefs(listStore);

  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const { execute, isLoading, data } =
    useAxios<V1ServerStatusRequestList>(axiosInstance);

  const isGettingMany = isLoading;
  const serverStatusRequests = ref([]);

  const getMany = async () => {
    try {
      await execute(`${ApiRoutes.SERVER_STATUS_REQUESTS}`, {
        method: 'GET',
        params: {
          offset: offset.value,
          limit: limit.value,
          search: filters.value.startWith,
        },
      });

      if (data?.value?.items) {
        serverStatusRequests.value = data?.value?.items;
        listStore.setTotal(data.value.total);
      }
    } catch (e) {}
  };

  return { getMany, isGettingMany, serverStatusRequests };
};
