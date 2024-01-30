import { defineStore } from 'pinia';

export interface AppStore {
  authType: string;
}

export const useAppStore = defineStore({
  id: 'app',
  state: () =>
    ({
      authType: null,
    } as AppStore),
});
