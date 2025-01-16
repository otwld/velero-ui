import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import type { App } from 'vue';
import { hasExpired } from '@velero-ui-app/utils/jwt.utils';

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
        const accessToken: string = localStorage.getItem('access_token');

        if (accessToken && !hasExpired(accessToken)) {
          onFulfilled.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return onFulfilled;
      },
    );

    app.config.globalProperties.axios = axiosInstance;
    app.provide('axios', axiosInstance);
  },
};
