import type { AxiosInstance } from 'axios';
import { inject } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { ApiRoutes } from '@velero-ui-app/utils/constants.utils';
import type { V1PluginInfo } from '@velero-ui/velero';

export const useSettingsPlugins = () => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  return useQuery<V1PluginInfo[]>({
    queryKey: ['settings', 'plugins'],
    retry: false,
    queryFn: async () =>
      (await axiosInstance.get(ApiRoutes.SETTINGS_VELERO_PLUGINS)).data,
    initialData: [],
  });
};
