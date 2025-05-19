import { defineStore } from 'pinia';
import { changeLocale } from '@formkit/vue';
import { i18n } from '@velero-ui-app/plugins/i18n.plugin';
import {
  getDefaultLocal,
  getDefaultTimezone,
} from '@velero-ui-app/utils/config.utils';

export interface AppStore {
  hideSidebar: boolean;
  language: string;
  timezone: string;
}

export const useAppStore = defineStore('app', {
  state: () =>
    ({
      hideSidebar: true,
      language: getDefaultLocal(),
      timezone: getDefaultTimezone(),
    }) as AppStore,
  actions: {
    toggleSidebar(): void {
      this.hideSidebar = !this.hideSidebar;
    },
    setLanguage(code: string) {
      this.language = code;
      changeLocale(code);
      i18n.global.locale.value = code;
      localStorage.setItem('language', code);
    },
    setTimezone(code: string) {
      this.timezone = code;
      localStorage.setItem('timezone', code);
    },
  },
});
