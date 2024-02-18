import type { V1DownloadRequest } from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { Ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { V1DownloadTargetKind } from '@velero-ui/velero';
import { ApiRoutes } from '../utils/constants.utils';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';

export const useLogsDownload = (
  name: Ref<string>,
  type: Ref<V1DownloadTargetKind>
) => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  const { execute, isLoading, data } =
    useAxios<V1DownloadRequest>(axiosInstance);

  const downloadLoading = isLoading;

  const download = async () => {
    try {
      if (type.value === V1DownloadTargetKind.BackupLog) {
        await execute(`${ApiRoutes.BACKUPS}/${name.value}/logs/download`, {
          method: 'POST',
        });
      } else if (type.value === V1DownloadTargetKind.RestoreLog) {
        await execute(`${ApiRoutes.RESTORES}/${name.value}/logs/download`, {
          method: 'POST',
        });
      }

      if (data?.value?.status?.downloadURL) {
        toastsStore.push('Download started..', ToastType.SUCCESS);
        window.open(data.value.status.downloadURL);
      }
    } catch (e) {
      toastsStore.push(
        'Unable to download logs, please try again.',
        ToastType.ERROR
      );
      console.error(e);
    }
  };

  return { download, downloadLoading };
};
