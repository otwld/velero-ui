import type { V1Schedule } from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { Ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { useScheduleStore } from '@velero-ui-app/stores/schedule.store';

export const useScheduleGet = (name: Ref<string>) => {
  const toastsStore = useToastsStore();
  const scheduleStore = useScheduleStore();

  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const { execute, isLoading, data } = useAxios<V1Schedule>(axiosInstance);

  const isGetting = isLoading;

  const get = async () => {
    try {
      await execute(`${ApiRoutes.SCHEDULES}/${name.value}`, {
        method: 'GET',
      });

      if (data?.value) {
        scheduleStore.set(data.value);
      }
    } catch (e) {
      toastsStore.push(
        "Unable to fetch schedule's information, please try again.",
        ToastType.ERROR
      );
      console.error(e);
    }
  };

  return { get, isGetting };
};
