import { QueryClient, useQuery, useQueryClient } from '@tanstack/vue-query';
import type { AxiosInstance } from 'axios';
import { inject } from 'vue';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { storeToRefs } from 'pinia';
import type { KubernetesObject } from '@kubernetes/client-node';
import type { Resource } from '@velero-ui/velero';

export const useKubernetesObject = <T extends KubernetesObject>(
  resource: Resource,
  name: string,
) => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const queryClient: QueryClient = useQueryClient();

  const listStore = useListStore();
  const { offset, limit, filters, sort } = storeToRefs(listStore);

  return useQuery<T>({
    queryKey: [resource.plurial, name],
    queryFn: async () =>
      (await axiosInstance.get<T>(`${resource.route}/${name}`)).data,
    refetchOnWindowFocus: false,
    refetchInterval: 1500,

    initialData: () => {
      return queryClient
        .getQueryData<T[]>([
          resource.plurial,
          {
            limit,
            offset,
            filters,
            sort,
          },
        ])
        ?.find((obj: T): boolean => obj.metadata.name === name);
    },
  });
};
