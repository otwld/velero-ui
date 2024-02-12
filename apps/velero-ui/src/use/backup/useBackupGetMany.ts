import type { V1BackupList } from '@velero-ui/velero';
import { useAxios } from '@vueuse/integrations/useAxios';
import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import { useBackupStore } from '../../stores/backup.store';
import { storeToRefs } from 'pinia';
import { useListStore } from '../../stores/list.store';

export const useBackupGetMany = () => {
  const backupStore = useBackupStore();
  const listStore = useListStore();
  const { offset, limit, filters } = storeToRefs(listStore);

  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const { execute, isLoading, data } = useAxios<V1BackupList>(axiosInstance);

  const isGettingMany = isLoading;

  const getMany = async () => {
    try {
      await execute(`${ApiRoutes.BACKUPS}`, {
        method: 'GET',
        params: {
          offset: offset.value,
          limit: limit.value,
          search: filters.value.startWith,
        },
      });

      if (data?.value?.items) {
        backupStore.setMany(data.value.items, data.value.total);
        listStore.setTotal(data.value.total);
      }
    } catch (e) {}
  };

  return { getMany, isGettingMany };
};
