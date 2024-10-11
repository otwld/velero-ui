import type { App } from 'vue';
import { io, type Socket } from 'socket.io-client';

export const registerSocketIo = (app: App): void => {
  const socket: Socket = io(import.meta.env.VITE_API_URL || '/api', {
    autoConnect: true,
  });

  app.config.globalProperties.socketIo = socket;
  app.provide('socketIo', socket);
};
