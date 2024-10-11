import { defineStore } from 'pinia';

export interface AppStore {
  authType: string;
  hideSidebar: boolean;
}

export const useAppStore = defineStore({
  id: 'app',
  state: () =>
    ({
      authType: 'test',
      hideSidebar: true,
    }) as AppStore,
  actions: {
    toggleSidebar(): void {
      this.hideSidebar = !this.hideSidebar;
    },
  },
});
