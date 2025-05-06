import { createI18n } from 'vue-i18n';
import { getMessages } from '@velero-ui/i18n';

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'en',
  fallbackLocale: 'en',
  messages: getMessages(),
});
