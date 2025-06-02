import { Resources, type V1DownloadRequest } from '@velero-ui/velero';
import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { useI18n } from 'vue-i18n';
import { useMutation } from '@tanstack/vue-query';
import { useListStore } from '@velero-ui-app/stores/list.store';

export const useBackupManyDownloadContent = () => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const { t } = useI18n();
  const listStore = useListStore();

  return useMutation({
    mutationFn: async (names: string[]) =>
      (
        await axiosInstance.post<V1DownloadRequest[]>(
          `${Resources.BACKUP.route}/download`,
          {
            data: names,
          }
        )
      ).data,
    onSuccess: async (data: V1DownloadRequest[]) => {
      if (data?.length > 0) {
        toastsStore.push(
          t('global.message.success.downloadsStarted'),
          ToastType.SUCCESS
        );
        listStore.resetCheckedItems();
        data.forEach((item: V1DownloadRequest) => {
          window.open(item.status.downloadURL);
        });
      }
    },
    onError: (error) => {
      toastsStore.push(
        t('global.message.error.unableToDownload'),
        ToastType.ERROR
      );
      console.error(error);
    },
  });
};
