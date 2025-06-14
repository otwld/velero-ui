import { Resources } from '@velero-ui/velero';
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
        await axiosInstance.get(
          `${Resources.BACKUP.route}/${name}/download`, { responseType: 'blob' }
        )
      ).data,
    onSuccess: async (data: Blob, name: string) => {
      if (data) {
        const blob = new Blob([data]);
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = url;
        link.setAttribute('download', `${name}.tar.gz`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
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
