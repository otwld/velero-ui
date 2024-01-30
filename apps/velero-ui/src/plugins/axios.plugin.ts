import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { App } from 'vue';
import type { UserManager, User } from 'oidc-client-ts';
import type { Pinia } from 'pinia';

export const registerAxios = (app: App, store: Pinia) => {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
  });

  axiosInstance.interceptors.request.use(
    async (onFulfilled: InternalAxiosRequestConfig) => {
      const oidcClient: UserManager = app.config.globalProperties
        .oidcClient as UserManager;
      const user: User = await oidcClient.getUser();

      if (user && user.access_token) {
        onFulfilled.headers['Authorization'] = `Bearer ${user.access_token}`;
      }

      return onFulfilled;
    }
  );

  app.config.globalProperties.axios = axiosInstance;
  app.provide('axios', axiosInstance);
  store.use(() => ({axios: axiosInstance}))
};
