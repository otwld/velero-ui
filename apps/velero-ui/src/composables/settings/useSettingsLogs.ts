import { inject } from 'vue';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/vue-query';
import type { SocketIO } from '@velero-ui-app/plugins/socket.plugin';

export const useSettingsLogs = (type: string, name?: string) => {
  const socket: SocketIO = inject('socketIo') as SocketIO;
  const queryClient: QueryClient = useQueryClient();

  const on = (): void => {
    socket.io.on(`settings:logs`, (data: string[]): void => {
      queryClient.setQueryData<string[]>(
        ['settings-logs', type],
        (oldData: string[]): string[] => {
          return oldData.concat(data);
        },
      );
    });
  };

  const off = (): void => {
    socket.io.off(`settings:logs`);
    socket.io.emit(`settings:logs:off`);
  };

  const { data } = useQuery<string[]>({
    queryKey: ['settings-logs', type],
    queryFn: async () => {
      socket.io.emit(`settings:logs:on`, { type, name });
      return [];
    },
    initialData: [],
  });

  return { on, off, data };
};
