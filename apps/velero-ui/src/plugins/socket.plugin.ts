import { type App, reactive } from 'vue';
import { io, type Socket } from 'socket.io-client';

export interface SocketIO {
  connected: boolean;
  lastError: Error;
  io: Socket;
}

const state: SocketIO = reactive({
  connected: false,
  lastError: undefined,
  io: undefined,
});

export const resetSocketIOConnection = () => {
  if (state.io) {
    state.io.off();
    state.io.close();
    state.connected = false;
  }

  state.io = io(import.meta.env.VITE_API_URL, {
    autoConnect: true,
    auth: (cb) => {
      const accessToken = localStorage.getItem('access_token');
      cb({ token: accessToken });
    },
  });

  state.io.on('connect_error', (error: Error) => {
    console.error(`Socket connection error:`, error);
    state.lastError = error;
  });

  state.io.on('connect', () => {
    state.connected = true;
  });

  state.io.on('disconnect', () => {
    state.connected = false;
  });
};

export const SocketIO = {
  install(app: App) {
    resetSocketIOConnection();
    app.provide('socketIo', state);
  },
};
