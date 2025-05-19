import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '@velero-ui-app/utils/constants.utils';
import { useQuery } from '@tanstack/vue-query';
import type { BackupsNextScheduled } from '@velero-ui/shared-types';

export const useStatsBackupsNextScheduled = () => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  return useQuery<BackupsNextScheduled[]>({
    queryKey: ['stats', 'backups-next-scheduled'],
    queryFn: async () =>
      (
        await axiosInstance.get<BackupsNextScheduled[]>(
          `${ApiRoutes.STATS}/backups/next-scheduled`
        )
      ).data,
    refetchOnWindowFocus: false,
    initialData: [],
  });
};
