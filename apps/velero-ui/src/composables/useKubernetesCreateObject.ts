import {
  type Resource,
  type V1BackupSpec,
  type V1BackupStorageLocationSpec,
  type V1RestoreSpec,
  type V1ScheduleSpec,
  type V1VolumeSnapshotLocationSpec,
} from '@velero-ui/velero';
import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import type {CreateBackupScheduleBody, CreateFormBody} from '@velero-ui/shared-types';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/vue-query';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { storeToRefs } from 'pinia';
import { type Router, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

export const useKubernetesCreateObject = (resource: Resource) => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const queryClient: QueryClient = useQueryClient();
  const router: Router = useRouter();

  const { t } = useI18n();
  const listStore = useListStore();
  const { offset, limit, filters, sort } = storeToRefs(listStore);

  return useMutation({
    mutationFn: async (
      body: CreateFormBody<
        | V1BackupSpec
        | V1BackupStorageLocationSpec
        | V1VolumeSnapshotLocationSpec
        | V1ScheduleSpec
        | V1RestoreSpec
        | CreateBackupScheduleBody
      >,
    ) => await axiosInstance.post(resource.route, body),
    onSuccess: async (response) => {
      await queryClient.cancelQueries({
        queryKey: [
          resource.plural,
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
          resource.plural,
          {
            limit,
            offset,
            filters,
            sort,
          },
        ],
      });

      toastsStore.push(
        t('global.message.success.created', { resource: resource.name }),
        ToastType.SUCCESS,
      );

      if (response.data) {
        await router.push(`${resource.route}/${response.data.metadata.name}`);
      }
    },
    onError: (error: Error): void => {
      toastsStore.push(
        t('global.message.error.unableToCreate', { resource: resource.name }),
        ToastType.ERROR,
      );
      console.error(error);
    },
  });
};
