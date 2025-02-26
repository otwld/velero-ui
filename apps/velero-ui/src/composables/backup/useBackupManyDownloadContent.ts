import type { V1DownloadRequest } from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { useI18n } from 'vue-i18n';
import { forEach } from 'lodash';

export const useBackupManyDownloadContent = () => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  const { t } = useI18n();
  const { execute, isLoading, data } =
    useAxios<V1DownloadRequest[]>(axiosInstance);

  const downloadLoading = isLoading;

  const download = async (names: string[]) => {
    try {
      await execute(`${ApiRoutes.BACKUPS}/download`, {
        method: 'POST',
        data: names,
      });

      console.log(data?.value);
      if (data?.value?.length > 0) {
        toastsStore.push(
          t('global.message.success.downloadsStarted'),
          ToastType.SUCCESS,
        );
        forEach(data.value, (item: V1DownloadRequest) => {
          window.open(item.status.downloadURL);
        });
      }
    } catch (e) {
      toastsStore.push(
        t('global.message.error.unableToDownload'),
        ToastType.ERROR,
      );
      console.error(e);
    }
  };

  return { download, downloadLoading };
};
