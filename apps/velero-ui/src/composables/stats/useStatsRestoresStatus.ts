import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '@velero-ui-app/utils/constants.utils';
import type { RestoresStatusStats } from '@velero-ui/shared-types';
import { useQuery } from '@tanstack/vue-query';

export const useStatsRestoresStatus = () => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  return useQuery<RestoresStatusStats>({
    queryKey: ['stats', 'restores-status'],
    queryFn: async () =>
      (
        await axiosInstance.get<RestoresStatusStats>(
          `${ApiRoutes.STATS}/restores/status`,
        )
      ).data,
    refetchOnWindowFocus: false,
    initialData: {
      series: [],
      labels: [],
      colors: []
    },
  });
};
