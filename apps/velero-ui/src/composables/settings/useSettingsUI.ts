import type { AxiosInstance } from 'axios';
import { inject } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { ApiRoutes } from '@velero-ui-app/utils/constants.utils';
import type { VeleroUiSettings } from '@velero-ui/shared-types';

export const useSettingsUI = () => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  return useQuery<VeleroUiSettings>({
    queryKey: ['settings', 'ui'],
    queryFn: async () =>
      (await axiosInstance.get(ApiRoutes.SETTINGS_VELERO_UI)).data,
  });
};
