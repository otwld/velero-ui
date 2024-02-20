import type {
  V1BackupRepository,
} from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { Ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { useBackupRepositoryStore } from '@velero-ui-app/stores/backup-repository.store';

export const useBackupRepositoryGet = (name: Ref<string>) => {
  const toastsStore = useToastsStore();
  const backupRepositoryStore = useBackupRepositoryStore();

  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const { execute, isLoading, data } =
    useAxios<V1BackupRepository>(axiosInstance);

  const get = async () => {
    try {
      await execute(`${ApiRoutes.BACKUP_REPOSITORIES}/${name.value}`, {
        method: 'GET',
      });

      if (data?.value) {
        backupRepositoryStore.set(data.value);
      }
    } catch (e) {
      toastsStore.push(
        "Unable to fetch backup repository's information, please try again.",
        ToastType.ERROR
      );
      console.error(e);
    }
  };

  return { get, isLoading };
};
