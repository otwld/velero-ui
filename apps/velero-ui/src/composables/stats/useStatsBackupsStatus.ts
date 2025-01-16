import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '@velero-ui-app/utils/constants.utils';
import type { BackupsStatusStats } from '@velero-ui/shared-types';
import { useQuery } from '@tanstack/vue-query';

export const useStatsBackupsStatus = () => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  return useQuery<BackupsStatusStats>({
    queryKey: ['stats', 'backups-status'],
    queryFn: async () =>
      (
        await axiosInstance.get<BackupsStatusStats>(
          `${ApiRoutes.STATS}/backups/status`,
        )
      ).data,
    refetchOnWindowFocus: false,
    initialData: {
      labels: [],
      series: [],
      colors: [],
    },
  });
};
