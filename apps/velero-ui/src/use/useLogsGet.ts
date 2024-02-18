import { useAxios } from '@vueuse/integrations/useAxios';
import { inject, ref } from 'vue';
import type { Ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { V1DownloadTargetKind } from '@velero-ui/velero';
import { ApiRoutes } from '../utils/constants.utils';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';

export const useLogsGet = (
  name: Ref<string>,
  type: Ref<V1DownloadTargetKind>
) => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  const { execute, isLoading, data } = useAxios<string[]>(axiosInstance);

  const isGetting = isLoading;
  const logs = ref([]);

  const get = async () => {
    try {
      if (type.value === V1DownloadTargetKind.BackupLog) {
        await execute(`${ApiRoutes.BACKUPS}/${name.value}/logs`, {
          method: 'GET',
        });
      } else if (type.value === V1DownloadTargetKind.RestoreLog) {
        await execute(`${ApiRoutes.RESTORES}/${name.value}/logs`, {
          method: 'GET',
        });
      }

      if (data?.value) {
        logs.value = data.value;
      }
    } catch (e) {
      toastsStore.push(
        'Unable to retrieve logs, please try again.',
        ToastType.ERROR
      );
      console.error(e);
    }
  };

  return { get, isGetting, logs };
};
