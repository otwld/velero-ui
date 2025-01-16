import { useAxios } from '@vueuse/integrations/useAxios';
import { inject, ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { V1DownloadTargetKind } from '@velero-ui/velero';
import { ApiRoutes } from '../utils/constants.utils';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { useI18n } from 'vue-i18n';

export const useLogsGet = (name: string, type: V1DownloadTargetKind) => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  const { t } = useI18n();
  const { execute, isLoading, data } = useAxios<string[]>(axiosInstance);

  const logs = ref([]);

  const get = async () => {
    try {
      if (type === V1DownloadTargetKind.BackupLog) {
        await execute(`${ApiRoutes.BACKUPS}/${name}/logs`, {
          method: 'GET',
        });
      } else if (type === V1DownloadTargetKind.RestoreLog) {
        await execute(`${ApiRoutes.RESTORES}/${name}/logs`, {
          method: 'GET',
        });
      }

      if (data?.value) {
        logs.value = data.value;
      }
    } catch (e) {
      toastsStore.push(
        t('global.message.error.unableToRetrieveLogs'),
        ToastType.ERROR,
      );
      console.error(e);
    }
  };

  return { get, isLoading, logs };
};
