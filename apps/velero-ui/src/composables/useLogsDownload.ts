import type {V1DownloadRequest} from '@velero-ui/velero';
import {V1DownloadTargetKind} from '@velero-ui/velero';
import {useAxios} from '@vueuse/integrations/useAxios';
import {inject} from 'vue';
import type {AxiosInstance} from 'axios';
import {ApiRoutes} from '../utils/constants.utils';
import {ToastType, useToastsStore} from '@velero-ui-app/stores/toasts.store';
import {useI18n} from "vue-i18n";

export const useLogsDownload = (name: string, type: V1DownloadTargetKind) => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  const {t} = useI18n();
  const {execute, isLoading, data} =
    useAxios<V1DownloadRequest>(axiosInstance);

  const download = async () => {
    try {
      if (type === V1DownloadTargetKind.BackupLog) {
        await execute(`${ApiRoutes.BACKUPS}/${name}/logs/download`, {
          method: 'POST',
        });
      } else if (type === V1DownloadTargetKind.RestoreLog) {
        await execute(`${ApiRoutes.RESTORES}/${name}/logs/download`, {
          method: 'POST',
        });
      }

      if (data?.value?.status?.downloadURL) {
        toastsStore.push(t('global.message.success.downloadStarted'), ToastType.SUCCESS);
        window.open(data.value.status.downloadURL);
      }
    } catch (e) {
      toastsStore.push(
      t('global.message.error.unableToDownloadLogs'),
        ToastType.ERROR,
      );
      console.error(e);
    }
  };

  return {download, isLoading};
};
