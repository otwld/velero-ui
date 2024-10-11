import type { V1PluginInfo, V1ServerStatusRequest } from '@velero-ui/velero';
import { defineStore } from 'pinia';
import { ApiRoutes } from '../utils/constants.utils';
import type { AxiosResponse } from 'axios';
import type {
  ClusterSettings,
  VeleroAgentSettings,
  VeleroServerSettings,
  VeleroUiSettings,
} from '@velero-ui/shared-types';

export interface SettingsStore {
  cluster: ClusterSettings;
  veleroServer: VeleroServerSettings;
  veleroAgents: VeleroAgentSettings[];
  veleroUi: VeleroUiSettings;
  plugins: V1PluginInfo[];
  serverLogs: string[];
}

export const useSettingsStore = defineStore({
  id: 'settings',
  state: () =>
    ({
      cluster: null,
      veleroUi: null,
      veleroAgents: [],
      veleroServer: null,
      plugins: [],
      serverLogs: [],
    }) as SettingsStore,
  getters: {},
  actions: {
    setServerLogs(logs: string[]): void {
      this.serverLogs = logs;
    },
    pushServerLogs(logs: string[]): void {
      this.serverLogs.concat(logs);
    },
    async fetchCluster() {
      try {
        const response = (await this.axios.get(
          ApiRoutes.SETTINGS_CLUSTER,
          {},
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
          {},
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
          {},
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
          {},
        )) as AxiosResponse;

        this.veleroUi = response.data;
      } catch (e) {
        console.error(e);
      }
    },
    async fetchVeleroPlugins() {
      try {
        const response: AxiosResponse<V1ServerStatusRequest> =
          (await this.axios.get(
            ApiRoutes.SETTINGS_VELERO_PLUGINS,
            {},
          )) as AxiosResponse<V1ServerStatusRequest>;

        this.plugins = response.data.status.plugins;
      } catch (e) {
        console.error(e);
      }
    },
  },
});
