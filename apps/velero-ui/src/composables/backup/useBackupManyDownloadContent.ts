import { Resources, type V1DownloadRequest } from '@velero-ui/velero';
import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { useI18n } from 'vue-i18n';
import { forEach } from 'lodash';
import { useMutation } from '@tanstack/vue-query';

export const useBackupManyDownloadContent = () => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const { t } = useI18n();

  return useMutation({
    mutationFn: async () =>
      (
        await axiosInstance.post<V1DownloadRequest[]>(
          `${Resources.BACKUP.route}/download`
        )
      ).data,
    onSuccess: async (data: V1DownloadRequest[]) => {
      if (data?.length > 0) {
        toastsStore.push(
          t('global.message.success.downloadsStarted'),
          ToastType.SUCCESS
        );
        forEach(data, (item: V1DownloadRequest) => {
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
