import { inject } from 'vue';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import type { AxiosInstance } from 'axios';
import { useAxios } from '@vueuse/integrations/useAxios';
import { ApiRoutes } from '@velero-ui-app/utils/constants.utils';
import type { RestoresSuccessRateStats } from '@velero-ui/shared-types';

export const useStatsRestoresSuccessRateGet = () => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  const { execute, isLoading, data } =
    useAxios<RestoresSuccessRateStats>(axiosInstance);

  const get = async () => {
    try {
      await execute(`${ApiRoutes.STATS}/restores/success-rate`, {
        method: 'GET',
      });
    } catch (e) {
      toastsStore.push(
        'Unable to retrieve stats, please try again.',
        ToastType.ERROR
      );
      console.error(e);
    }
  };

  return { get, isLoading, data };
};
