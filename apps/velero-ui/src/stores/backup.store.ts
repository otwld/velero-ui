import { defineStore } from 'pinia';

import { ApiRoutes } from '../utils/constants.utils';
import type { AxiosResponse } from 'axios';
import type {
  V1Backup,
  V1BackupList,
  V1DownloadRequest,
} from '@velero-ui/velero';

export interface BackupSearchFilters {
  startWith: string;
}

export interface BackupStore {
  backups: V1Backup[];
  backup: V1Backup;
  backupLogs: string[];
  total: number;
  offset: number;
  limit: number;
  filters: BackupSearchFilters;
}

export const useBackupStore = defineStore({
  id: 'backup',
  state: () =>
    ({
      backups: [],
      backup: undefined,
      backupLogs: undefined,
      total: 0,
      offset: 0,
      limit: 20,
      filters: {
        search: null,
      },
    } as BackupStore),
  actions: {
    async get(name: string) {
      try {
        this.backup = this.backups.find(
          (b: V1Backup): boolean => b?.metadata?.name === name
        );

        if (!this.backup) {
          const response: AxiosResponse<V1Backup> = (await this.axios.get(
            `${ApiRoutes.BACKUPS}/${name}`,
            {}
          )) as AxiosResponse<V1Backup>;

          this.backup = response.data;
        }
      } catch (e) {
        this.backup = undefined;
        console.error(e);
      }
    },
    async logs(name: string) {
      try {
        const response: AxiosResponse<string[]> = (await this.axios.get(
          `${ApiRoutes.BACKUPS}/${name}/logs`,
          {}
        )) as AxiosResponse<string[]>;

        this.backupLogs = response.data;
      } catch (e) {
        this.backupLogs = [];
        console.error(e);
      }
    },
    async fetch() {
      try {
        const response: AxiosResponse<V1BackupList> = (await this.axios.get(
          ApiRoutes.BACKUPS,
          {
            params: {
              offset: this.offset,
              limit: this.limit,
              search: this.filters.search,
            },
          }
        )) as AxiosResponse<V1BackupList>;

        this.backups = response.data.items;
        this.total = response.data.total;
      } catch (e) {
        console.error(e);
      }
    },
    async download(name: string) {
      try {
        const response: AxiosResponse<V1DownloadRequest> =
          (await this.axios.post(
            `${ApiRoutes.BACKUPS}/${name}/download`
          )) as AxiosResponse<V1DownloadRequest>;

        if (response) {
          window.open(response.data.status.downloadURL);
        }
      } catch (e) {
        console.error(e);
      }
    },
    async downloadLogs(name: string) {
      try {
        const response: AxiosResponse<V1DownloadRequest> =
          (await this.axios.post(
            `${ApiRoutes.BACKUPS}/${name}/logs/download`
          )) as AxiosResponse<V1DownloadRequest>;

        if (response) {
          window.open(response.data.status.downloadURL);
        }
      } catch (e) {
        console.error(e);
      }
    },
    async delete(names: string[]) {
      try {
        const response = (await this.axios.delete(
          `${ApiRoutes.BACKUPS}}`
        )) as AxiosResponse;

        this.fetch();
      } catch (e) {
        console.error(e);
      }
    },
    next() {
      if (this.offset + this.limit < this.total) {
        this.offset += 20;
        this.fetch();
      }
    },
    previous() {
      this.offset -= 20;

      if (this.offset < 0) {
        this.offset = 0;
      }

      this.fetch();
    },
    applyNameFilter(name: string) {
      this.offset = 0;
      this.filters.search = name;
      this.fetch();
    },
  },
});
