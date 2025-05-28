import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { Resources, V1DownloadTargetKind } from '@velero-ui/velero';
import { useQuery } from '@tanstack/vue-query';
import type { VeleroLog } from "@velero-ui/shared-types";

export const useLogsGet = (name: string, type: V1DownloadTargetKind) => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  let route = '';
  if (type === V1DownloadTargetKind.BackupLog) {
    route = Resources.BACKUP.route;
  } else if (type === V1DownloadTargetKind.RestoreLog) {
    route = Resources.RESTORE.route;
  }

  return useQuery<VeleroLog[]>({
    queryKey: [type, name],
    queryFn: async () =>
      (await axiosInstance.get<VeleroLog[]>(`${route}/${name}/logs`)).data,
    refetchOnWindowFocus: false,
    enabled: false,
    initialData: [],
  });
};
