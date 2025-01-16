import type { V1DownloadRequest } from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import type { Ref } from 'vue';
import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { useI18n } from 'vue-i18n';

export const useBackupDownloadContent = (name: Ref<string>) => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  const { t } = useI18n();
  const { execute, isLoading, data } =
    useAxios<V1DownloadRequest>(axiosInstance);

  const downloadLoading = isLoading;

  const download = async () => {
    try {
      await execute(`${ApiRoutes.BACKUPS}/${name.value}/download`, {
        method: 'POST',
      });

      if (data?.value?.status?.downloadURL) {
        toastsStore.push(
          t('global.message.success.downloadStarted'),
          ToastType.SUCCESS,
        );
        window.open(data.value.status.downloadURL);
      }
    } catch (e) {
      toastsStore.push(t('global.message.error.unableToDownload'), ToastType.ERROR);
      console.error(e);
    }
  };

  return { download, downloadLoading };
};
