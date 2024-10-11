import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import type { App } from 'vue';
import type { Pinia } from 'pinia';
import { hasExpired } from '@velero-ui-app/utils/jwt.utils';

export const registerAxios = (app: App, store: Pinia): void => {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
  });

  axiosInstance.interceptors.request.use(
    async (onFulfilled: InternalAxiosRequestConfig) => {
      const accessToken: string = localStorage.getItem('access_token');

      if (accessToken && !hasExpired(accessToken)) {
        onFulfilled.headers['Authorization'] = `Bearer ${accessToken}`;
      }

      return onFulfilled;
    },
  );

  app.config.globalProperties.axios = axiosInstance;
  app.provide('axios', axiosInstance);
  store.use(() => ({ axios: axiosInstance }));
};
