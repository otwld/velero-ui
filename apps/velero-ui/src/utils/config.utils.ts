import type { App } from 'vue';
import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import type { AppPublicConfig } from '@velero-ui/shared-types';

export const registerConfig = async (app: App): Promise<void> => {
  try {
    let baseURL = '/api';

    if (import.meta.env.VITE_API_URL) {
      baseURL = `${import.meta.env.VITE_API_URL}/api`;
    }

    const axiosInstance: AxiosInstance = axios.create({
      baseURL,
    });

    const config: AxiosResponse<AppPublicConfig> =
      await axiosInstance.get('/config');

    app.config.globalProperties = {
      ...app.config.globalProperties,
      ...config.data,
    };
    app.provide('config', config.data);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getDefaultLocal = (): string => {
  const lang: string = localStorage.getItem('language');
  if (lang) {
    return lang;
  }

  const defaultLang: string = import.meta.env.DEFAULT_LANGUAGE || 'en';
  localStorage.setItem('language', defaultLang);
  return defaultLang;
};

export const getDefaultTimezone = (): string => {
  const timezone: string = localStorage.getItem('timezone');
  if (timezone) {
    return timezone;
  }

  const defaultTimezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    import.meta.env.DEFAULT_TIMEZONE;
  localStorage.setItem('timezone', defaultTimezone);
  return defaultTimezone;
};
