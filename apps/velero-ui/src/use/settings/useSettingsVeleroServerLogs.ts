import { Socket } from 'socket.io-client';
import { inject } from 'vue';
import { useSettingsStore } from '@velero-ui-app/stores/settings.store';

export const useSettingsVeleroServerLogs = () => {
  const settingsStore = useSettingsStore();

  const socket = inject('socketIo') as Socket;

  const get = () => {
    socket.emit('subscribe', {}, (response: string[]) =>
      settingsStore.setServerLogs(response),
    );
    // const t = socket.on('settings:server:logs', (data): void => {});
  };

  const on = () =>
    socket.on('settings:server:logs', (data: string[]): void =>
      settingsStore.pushServerLogs(data),
    );

  const off = () => socket.off('settings:server:logs');

  return { on, off };
};
