import type { V1DownloadRequest } from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { Ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';

export const useBackupDownloadContent = (name: Ref<string>) => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  const { execute, isLoading, data } =
    useAxios<V1DownloadRequest>(axiosInstance);

  const downloadLoading = isLoading;

  const download = async () => {
    try {
      await execute(`${ApiRoutes.BACKUPS}/${name.value}/download`, {
        method: 'POST',
      });

      if (data?.value?.status?.downloadURL) {
        window.open(data.value.status.downloadURL);
      }
    } catch (e) {}
  };

  return { download, downloadLoading };
};
