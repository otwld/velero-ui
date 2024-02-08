import type { V1DeleteBackupRequest } from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { Ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import { useBackupStore } from '../../stores/backup.store';

export const useBackupDelete = (name: Ref<string>) => {
  const backupStore = useBackupStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  const { execute, isLoading, data } =
    useAxios<V1DeleteBackupRequest>(axiosInstance);

  const deleteLoading = isLoading;

  const remove = async () => {
    try {
      await execute(`${ApiRoutes.BACKUPS}/${name.value}`, {
        method: 'DELETE',
      });

      if (data?.value) {
        backupStore.delete(name.value);
      }
    } catch (e) {}
  };

  return { remove, deleteLoading };
};
