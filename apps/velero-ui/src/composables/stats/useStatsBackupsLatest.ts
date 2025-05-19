import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '@velero-ui-app/utils/constants.utils';
import { useQuery } from '@tanstack/vue-query';
import type { BackupsLatest } from '@velero-ui/shared-types';

export const useStatsBackupsLatest = () => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  return useQuery<BackupsLatest[]>({
    queryKey: ['stats', 'backups-latest'],
    queryFn: async () =>
      (
        await axiosInstance.get<BackupsLatest[]>(
          `${ApiRoutes.STATS}/backups/latest`
        )
      ).data,
    refetchOnWindowFocus: false,
    initialData: [],
  });
};
