import { inject } from 'vue';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/vue-query';
import type { SocketIO } from '@velero-ui-app/plugins/socket.plugin';
import { type Log, LogType } from '@velero-ui/shared-types';

export const useSettingsLogs = (type: LogType, name?: string) => {
  const socket: SocketIO = inject('socketIo') as SocketIO;
  const queryClient: QueryClient = useQueryClient();

  const on = (): void => {
    socket.io.on(`settings:logs`, (data: Log[]): void => {
      queryClient.setQueryData<Log[]>(
        ['settings-logs', type],
        (oldData: Log[]): Log[] => {
          return oldData.concat(data);
        }
      );
    });
  };

  const off = (): void => {
    socket.io.off(`settings:logs`);
    socket.io.emit(`settings:logs:off`);
  };

  const { data } = useQuery<Log[]>({
    queryKey: ['settings-logs', type],
    queryFn: async () => {
      socket.io.emit(`settings:logs:on`, { type, name });
      return [];
    },
    initialData: [],
    refetchOnWindowFocus: false,
  });

  return { on, off, data };
};
