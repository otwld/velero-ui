import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '@velero-ui-app/utils/constants.utils';
import type { BasicStats } from '@velero-ui/shared-types';
import { useQuery } from '@tanstack/vue-query';

export const useStatsBasic = () => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  return useQuery<BasicStats>({
    queryKey: ['stats', 'basics'],
    queryFn: async () =>
      (await axiosInstance.get<BasicStats>(ApiRoutes.STATS)).data,
    refetchOnWindowFocus: false,
  });
};
