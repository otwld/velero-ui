import {
  type Resource,
  type V1BackupStorageLocationSpec,
  type V1ScheduleSpec,
  type V1VolumeSnapshotLocationSpec,
} from '@velero-ui/velero';
import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import type { EditFormBody } from '@velero-ui/shared-types';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/vue-query';
import { useI18n } from 'vue-i18n';

export const useKubernetesEditObject = (resource: Resource, name: string) => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const queryClient: QueryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: async (
      body: EditFormBody<
        | V1BackupStorageLocationSpec
        | V1VolumeSnapshotLocationSpec
        | V1ScheduleSpec
      >,
    ) => await axiosInstance.put(`${resource.route}/${name}`, body),
    onSuccess: async (response) => {
      await queryClient.cancelQueries({
        queryKey: [resource.plural, name],
      });

      await queryClient.invalidateQueries({
        queryKey: [resource.plural, name],
      });

      toastsStore.push(
        t('global.message.success.edited', { resource: resource.name }),
        ToastType.SUCCESS,
      );
    },
    onError: (error: Error): void => {
      toastsStore.push(
        t('global.message.error.unableToEdit', { resource: resource.name }),
        ToastType.ERROR,
      );
      console.error(error);
    },
  });
};
