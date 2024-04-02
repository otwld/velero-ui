import type { V1DeleteBackupRequest } from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';

export const useBackupCreate = () => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  const { execute, isLoading, data } =
    useAxios<V1DeleteBackupRequest>(axiosInstance);

  const isCreating = isLoading;

  const create = async () => {
    try {
      await execute(`${ApiRoutes.BACKUPS}`, {
        method: 'POST',
        data: {},
      });

      if (data?.value) {
        // Todo
      }
    } catch (e) {
      console.error(e);
    }
  };

  return { create, isCreating };
};
