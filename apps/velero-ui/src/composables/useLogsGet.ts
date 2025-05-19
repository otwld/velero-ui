import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { Resources, V1DownloadTargetKind } from '@velero-ui/velero';
import { useQuery } from '@tanstack/vue-query';

export const useLogsGet = (name: string, type: V1DownloadTargetKind) => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  let route = '';
  if (type === V1DownloadTargetKind.BackupLog) {
    route = Resources.BACKUP.route;
  } else if (type === V1DownloadTargetKind.RestoreLog) {
    route = Resources.RESTORE.route;
  }

  return useQuery<string[]>({
    queryKey: [type, name],
    queryFn: async () =>
      (await axiosInstance.get<string[]>(`${route}/${name}/logs`)).data,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};
