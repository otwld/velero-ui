import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import type { App } from 'vue';
import { hasExpired } from '@velero-ui-app/utils/jwt.utils';
import {
  getDefaultLocal,
  getDefaultTimezone,
} from '@velero-ui-app/utils/config.utils';

export const Axios = {
  install(app: App) {
    let baseURL = '/api';

    if (import.meta.env.VITE_API_URL) {
      baseURL = `${import.meta.env.VITE_API_URL}/api`;
    }

    const axiosInstance: AxiosInstance = axios.create({
      baseURL,
    });

    axiosInstance.interceptors.request.use(
      async (onFulfilled: InternalAxiosRequestConfig) => {
        if (!onFulfilled.url.startsWith('/')) {
          return onFulfilled;
        }

        const accessToken: string = localStorage.getItem('access_token');

        if (accessToken && !hasExpired(accessToken)) {
          onFulfilled.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        onFulfilled.headers['Accept-Language'] = getDefaultLocal();
        onFulfilled.headers['Time-Zone'] = getDefaultTimezone();

        return onFulfilled;
      }
    );

    app.config.globalProperties.axios = axiosInstance;
    app.provide('axios', axiosInstance);
  },
};
