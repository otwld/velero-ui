import { QueryClient, useMutation, useQueryClient } from '@tanstack/vue-query';
import type { AxiosInstance } from 'axios';
import { inject, type Ref } from 'vue';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { storeToRefs } from 'pinia';
import { Resources, type V1Schedule } from '@velero-ui/velero';

export const usePauseSchedule = (name: Ref<string>) => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const queryClient: QueryClient = useQueryClient();

  const listStore = useListStore();
  const { offset, limit, filters, sort } = storeToRefs(listStore);

  return useMutation({
    mutationFn: async (toggle: boolean) =>
      await axiosInstance.post(
        `${Resources.SCHEDULE.route}/${name.value}/${toggle ? 'pause' : 'unpause'}`,
      ),
    onSuccess: async (response, toggle: boolean) => {
      await queryClient.cancelQueries({
        queryKey: [
          Resources.SCHEDULE.plurial,
          {
            limit,
            offset,
            filters,
            sort,
          },
        ],
      });
      await queryClient.cancelQueries({
        queryKey: [Resources.SCHEDULE.plurial, name.value],
      });

      queryClient.setQueryData(
        [Resources.SCHEDULE.plurial, name.value],
        response.data,
      );

      toastsStore.push(
        toggle ? 'Schedule paused' : 'Schedule unpaused',
        ToastType.SUCCESS,
      );

      const previousSchedules: V1Schedule[] = queryClient.getQueryData([
        Resources.SCHEDULE.plurial,
        {
          limit,
          offset,
          filters,
          sort,
        },
      ]) as V1Schedule[];

      if (previousSchedules) {
        const index: number = previousSchedules.findIndex(
          (b: V1Schedule): boolean => b.metadata.name === name.value,
        );

        if (index !== -1) {
          previousSchedules[index] = response.data;
        }

        queryClient.setQueryData(
          [
            Resources.SCHEDULE.plurial,
            {
              limit,
              offset,
              filters,
              sort,
            },
          ],
          () => [...previousSchedules],
        );
        return previousSchedules;
      }
    },
    onError: (error: Error): void => {
      toastsStore.push(
        'An unexpected error has occurred, please try again.',
        ToastType.ERROR,
      );
      console.error(error);
    },
  });
};
