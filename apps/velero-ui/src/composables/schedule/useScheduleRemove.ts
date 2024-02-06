import { useScheduleStore } from '../../stores/schedule.store';
import type { V1Schedule } from '@velero-ui/velero';
import { ApiRoutes } from '../../utils/constants.utils';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { Ref } from 'vue';
import type { AxiosInstance } from 'axios';

export const useScheduleRemove = (name: Ref<string>) => {
  const scheduleStore = useScheduleStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  const { execute, isLoading, data } = useAxios<V1Schedule>(axiosInstance);

  const removeLoading = isLoading;

  const remove = async () => {
    try {
      await execute(
        `${ApiRoutes.SCHEDULES}/${name.value}`,
        {
          method: 'DELETE',
        }
      );

      if (data.value) {
        // DELETED
      }
    } catch (e) {}
  };

  return { remove, removeLoading };
};
