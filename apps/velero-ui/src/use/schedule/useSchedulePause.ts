import { useScheduleStore } from '../../stores/schedule.store';
import type { V1Schedule } from '@velero-ui/velero';
import { ApiRoutes } from '../../utils/constants.utils';
import { useAxios } from '@vueuse/integrations/useAxios';
import type { Ref } from 'vue';
import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';

export const useSchedulePause = (name: Ref<string>) => {
  const scheduleStore = useScheduleStore();
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  const { execute, isLoading, data } = useAxios<V1Schedule>(axiosInstance);

  const togglePauseLoading = isLoading;

  const togglePause = async (toggle: boolean) => {
    try {
      await execute(
        `${ApiRoutes.SCHEDULES}/${name.value}/${toggle ? 'pause' : 'unpause'}`,
        {
          method: 'POST',
        }
      );

      if (data.value) {
        scheduleStore.togglePause(name.value, toggle);
        toastsStore.push(
          toggle ? 'Schedule paused' : 'Schedule unpaused',
          ToastType.SUCCESS
        );
      }
    } catch (e) {
      toastsStore.push(
        'An unexpected error has occurred, please try again.',
        ToastType.ERROR
      );
      console.error(e);
    }
  };

  return { togglePause, togglePauseLoading };
};
