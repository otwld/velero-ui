import {
  type QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/vue-query';
import type { AxiosInstance } from 'axios';
import { inject, type Ref } from 'vue';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { Resources, type V1Schedule } from '@velero-ui/velero';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

export const usePauseSchedule = (name: Ref<string>) => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const queryClient: QueryClient = useQueryClient();

  const { t } = useI18n();
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
          Resources.SCHEDULE.plural,
          {
            limit,
            offset,
            filters,
            sort,
          },
        ],
      });
      await queryClient.cancelQueries({
        queryKey: [Resources.SCHEDULE.plural, name.value],
      });

      queryClient.setQueryData(
        [Resources.SCHEDULE.plural, name.value],
        response.data,
      );

      const previousSchedules: V1Schedule[] = queryClient.getQueryData([
        Resources.SCHEDULE.plural,
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
          const updatedSchedules: V1Schedule[] = [...previousSchedules];
          updatedSchedules[index] = response.data;

          queryClient.setQueryData(
            [
              Resources.SCHEDULE.plural,
              {
                limit,
                offset,
                filters,
                sort,
              },
            ],
            () => updatedSchedules,
          );
        }
      }

      toastsStore.push(
        toggle
          ? t('schedules.message.success.paused')
          : t('schedules.message.success.resumed'),
        ToastType.SUCCESS,
      );
    },
    onError: (error: Error): void => {
      toastsStore.push(
        t('global.message.error.unexpected'),
        ToastType.ERROR,
      );
      console.error(error);
    },
  });
};
