import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import type { AxiosInstance } from 'axios';
import { inject } from 'vue';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { storeToRefs } from 'pinia';
import type {
  KubernetesListObject,
  KubernetesObject,
} from '@kubernetes/client-node';
import type { Resource } from '@velero-ui/velero';

export const useKubernetesListObject = <
  R extends KubernetesObject,
  T extends KubernetesListObject<R>,
>(
  resource: Resource,
) => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  const listStore = useListStore();
  const { offset, limit, filters, sort } = storeToRefs(listStore);

  return useQuery<R[]>({
    queryKey: [
      resource.plurial,
      {
        limit,
        offset,
        filters,
        sort,
      },
    ],
    queryFn: async () => {
      const response = await axiosInstance.get<T>(resource.route, {
        params: {
          limit: limit.value,
          offset: offset.value,
          search: filters.value.startWith,
          sortColumnName: sort.value.column.name,
          sortColumnAscending: sort.value.column.ascending,
        },
      });
      listStore.setTotal(response.data?.total);
      return response.data.items;
    },
    initialData: [],
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};
