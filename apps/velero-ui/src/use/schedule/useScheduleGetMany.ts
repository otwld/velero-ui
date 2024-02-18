import type { V1ScheduleList } from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import { storeToRefs } from 'pinia';
import { useListStore } from '../../stores/list.store';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { useScheduleStore } from '@velero-ui-app/stores/schedule.store';

export const useScheduleGetMany = () => {
  const scheduleStore = useScheduleStore();
  const listStore = useListStore();
  const toastsStore = useToastsStore();
  const { offset, limit, filters } = storeToRefs(listStore);

  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const { execute, isLoading, data } = useAxios<V1ScheduleList>(axiosInstance);

  const isGettingMany = isLoading;

  const getMany = async () => {
    try {
      await execute(`${ApiRoutes.SCHEDULES}`, {
        method: 'GET',
        params: {
          offset: offset.value,
          limit: limit.value,
          search: filters.value.startWith,
        },
      });

      if (data?.value?.items) {
        scheduleStore.setMany(data.value.items);
        listStore.setTotal(data.value.total);
      }
    } catch (e) {
      toastsStore.push(
        'Unable to fetch schedules, please try again.',
        ToastType.ERROR
      );
      console.error(e);
    }
  };

  return { getMany, isGettingMany };
};
