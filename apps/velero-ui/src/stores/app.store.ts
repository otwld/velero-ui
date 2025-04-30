import { defineStore } from 'pinia';

export interface AppStore {
  hideSidebar: boolean;
  language: string;
}

export const useAppStore = defineStore('app',{
  state: () =>
    ({
      hideSidebar: true,
      language: 'en',
    }) as AppStore,
  actions: {
    toggleSidebar(): void {
      this.hideSidebar = !this.hideSidebar;
    }
  },
});
