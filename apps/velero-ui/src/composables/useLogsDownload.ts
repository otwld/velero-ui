import {
  Resources,
  type V1DownloadRequest,
  V1DownloadTargetKind,
} from '@velero-ui/velero';
import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { useI18n } from 'vue-i18n';
import { useMutation } from '@tanstack/vue-query';

export const useLogsDownload = (name: string, type: V1DownloadTargetKind) => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const { t } = useI18n();

  let route = '';
  if (type === V1DownloadTargetKind.BackupLog) {
    route = Resources.BACKUP.route;
  } else if (type === V1DownloadTargetKind.RestoreLog) {
    route = Resources.RESTORE.route;
  }

  return useMutation({
    mutationFn: async () =>
      (
        await axiosInstance.post<V1DownloadRequest>(
          `${route}/${name}/logs/download`
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
        t('global.message.error.unableToDownloadLogs'),
        ToastType.ERROR
      );
      console.error(error);
    },
  });
};
