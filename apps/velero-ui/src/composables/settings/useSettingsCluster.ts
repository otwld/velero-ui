import type { AxiosInstance } from 'axios';
import { inject } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { ApiRoutes } from '@velero-ui-app/utils/constants.utils';
import type { ClusterSettings } from '@velero-ui/shared-types';

export const useSettingsCluster = () => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  return useQuery<ClusterSettings>({
    queryKey: ['settings', 'cluster'],
    queryFn: async () =>
      (await axiosInstance.get(ApiRoutes.SETTINGS_CLUSTER)).data,
  });
};
