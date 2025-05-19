import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '@velero-ui-app/utils/constants.utils';
import { useQuery } from '@tanstack/vue-query';

export const useStatsUnscheduledNamespaces = () => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  return useQuery<string[]>({
    queryKey: ['stats', 'unscheduled-namespaces'],
    queryFn: async () =>
      (
        await axiosInstance.get<string[]>(
          `${ApiRoutes.STATS}/unscheduled-namespaces`
        )
      ).data,
    refetchOnWindowFocus: false,
    initialData: [],
  });
};
