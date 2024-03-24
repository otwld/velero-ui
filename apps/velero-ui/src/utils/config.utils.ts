import type { App } from 'vue';
import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { AppPublicConfig } from '@velero-ui/shared-types';

export const registerConfig = async (app: App): Promise<void> => {
  try {
    const axiosInstance: AxiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
    });

    const config: AxiosResponse<AppPublicConfig> = await axiosInstance.get(
      '/config'
    );

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
