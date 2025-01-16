import type { AxiosInstance } from 'axios';
import { inject } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { ApiRoutes } from '@velero-ui-app/utils/constants.utils';
import type { VeleroServerSettings } from '@velero-ui/shared-types';

export const useSettingsServer = () => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  return useQuery<VeleroServerSettings>({
    queryKey: ['settings', 'server'],
    queryFn: async () =>
      (await axiosInstance.get(ApiRoutes.SETTINGS_VELERO_SERVER)).data,
  });
};
