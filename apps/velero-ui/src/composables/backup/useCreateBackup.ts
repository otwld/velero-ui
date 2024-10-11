import { Resources } from '@velero-ui/velero';
import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import type { CreateBackupFormBody } from '@velero-ui/shared-types';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/vue-query';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { storeToRefs } from 'pinia';

export const useCreateBackup = () => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const queryClient: QueryClient = useQueryClient();

  const listStore = useListStore();
  const { offset, limit, filters, sort } = storeToRefs(listStore);

  return useMutation({
    mutationFn: async (body: CreateBackupFormBody) =>
      await axiosInstance.post(Resources.BACKUP.route, body),
    onSuccess: async () => {
      await queryClient.cancelQueries({
        queryKey: [
          Resources.BACKUP.plurial,
          {
            limit,
            offset,
            filters,
            sort,
          },
        ],
      });

      await queryClient.invalidateQueries({
        queryKey: [
          Resources.BACKUP.plurial,
          {
            limit,
            offset,
            filters,
            sort,
          },
        ],
      });

      toastsStore.push(
        'Backup created, request will now be processed by velero server.',
        ToastType.SUCCESS,
      );
    },
    onError: (error: Error): void => {
      toastsStore.push(
        'Unable to create the backup, please try again.',
        ToastType.ERROR,
      );
      console.error(error);
    },
  });
};
