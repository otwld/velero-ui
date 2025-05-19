import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '@velero-ui-app/utils/constants.utils';
import { useQuery } from '@tanstack/vue-query';
import type { BackupsLasted } from '@velero-ui/shared-types';

export const useStatsBackupsLasted = () => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  return useQuery<BackupsLasted[]>({
    queryKey: ['stats', 'backups-lasted'],
    queryFn: async () =>
      (
        await axiosInstance.get<BackupsLasted[]>(
          `${ApiRoutes.STATS}/backups/lasted`
        )
      ).data,
    refetchOnWindowFocus: false,
    initialData: [],
  });
};
