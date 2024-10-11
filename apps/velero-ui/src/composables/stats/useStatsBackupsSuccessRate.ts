import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '@velero-ui-app/utils/constants.utils';
import type { BackupsSuccessRateStats } from '@velero-ui/shared-types';
import { useQuery } from '@tanstack/vue-query';

export const useStatsBackupsSuccessRate = () => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  return useQuery<BackupsSuccessRateStats>({
    queryKey: ['stats', 'backups-success-rate'],
    queryFn: async () =>
      (
        await axiosInstance.get<BackupsSuccessRateStats>(
          `${ApiRoutes.STATS}/backups/success-rate`,
        )
      ).data,
    refetchOnWindowFocus: false,
    initialData: {
      series: [],
    },
  });
};
