import { useScheduleStore } from '../../stores/schedule.store';
import type { V1Schedule } from '@velero-ui/velero';
import { ApiRoutes } from '../../utils/constants.utils';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { Ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';

export const useScheduleRemove = (name: Ref<string>) => {
  const toastsStore = useToastsStore();
  const scheduleStore = useScheduleStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  const { execute, isLoading, data } = useAxios<V1Schedule>(axiosInstance);

  const removeLoading = isLoading;

  const remove = async () => {
    try {
      await execute(`${ApiRoutes.SCHEDULES}/${name.value}`, {
        method: 'DELETE',
      });

      if (data.value) {
        scheduleStore.delete(name.value);
        toastsStore.push('Schedule deleted.', ToastType.SUCCESS);
      }
    } catch (e) {
      toastsStore.push(
        'Unable to delete the schedule, please try again.',
        ToastType.ERROR
      );
      console.error(e);
    }
  };

  return { remove, removeLoading };
};
