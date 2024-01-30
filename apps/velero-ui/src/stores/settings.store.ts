import type {
  ClusterSettings,
  VeleroAgentSettings,
  VeleroServerSettings,
  VeleroUiSettings,
} from '@velero-ui/shared-types';
import { defineStore } from 'pinia';
import { ApiRoutes } from '../utils/constants.utils';
import type { AxiosResponse } from 'axios';

export interface SettingsStore {
  cluster: ClusterSettings;
  veleroServer: VeleroServerSettings;
  veleroAgents: VeleroAgentSettings[];
  veleroUi: VeleroUiSettings;
}

export const useSettingsStore = defineStore({
  id: 'settings',
  state: () =>
    ({
      cluster: null,
      veleroUi: null,
      veleroAgents: [],
      veleroServer: null,
    } as SettingsStore),
  getters: {},
  actions: {
    async fetchCluster() {
      try {
        const response = (await this.axios.get(
          ApiRoutes.SETTINGS_CLUSTER,
          {}
        )) as AxiosResponse;

        this.cluster = response.data;
      } catch (e) {
        console.error(e);
      }
    },
    async fetchVeleroServer() {
      try {
        const response = (await this.axios.get(
          ApiRoutes.SETTINGS_VELERO_SERVER,
          {}
        )) as AxiosResponse;

        this.veleroServer = response.data;
      } catch (e) {
        console.error(e);
      }
    },
    async fetchVeleroAgents() {
      try {
        const response = (await this.axios.get(
          ApiRoutes.SETTINGS_VELERO_AGENTS,
          {}
        )) as AxiosResponse;

        this.veleroAgents = response.data;
      } catch (e) {
        console.error(e);
      }
    },
    async fetchVeleroUi() {
      try {
        const response = (await this.axios.get(
          ApiRoutes.SETTINGS_VELERO_UI,
          {}
        )) as AxiosResponse;

        this.veleroUi = response.data;
      } catch (e) {
        console.error(e);
      }
    },
  },
});
