import { Resources, type V1DownloadRequest } from '@velero-ui/velero';
import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { useI18n } from 'vue-i18n';
import { useMutation } from '@tanstack/vue-query';

export const useBackupDownloadContent = () => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  const { t } = useI18n();

  return useMutation({
    mutationFn: async (name: string) =>
      (
        await axiosInstance.post<V1DownloadRequest>(
          `${Resources.BACKUP.route}/${name}/download`
        )
      ).data,
    onSuccess: async (data: V1DownloadRequest) => {
      if (data?.status?.downloadURL) {
        toastsStore.push(
          t('global.message.success.downloadStarted'),
          ToastType.SUCCESS
        );
        window.open(data.status.downloadURL);
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
