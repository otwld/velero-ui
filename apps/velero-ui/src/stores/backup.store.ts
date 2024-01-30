import { defineStore } from 'pinia';
import type { Backup } from '@velero-ui/shared-types';

import { ApiRoutes } from '../utils/constants.utils';
import type { AxiosResponse } from 'axios';

export interface BackupSearchFilters {
  startWith: string;
}

export interface BackupStore {
  backups: Backup[];
  backup: Backup;
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
      total: 0,
      offset: 0,
      limit: 20,
      filters: {
        search: null,
      },
    } as BackupStore),
  actions: {
    async get(name: string, namespace: string) {
      try {
        this.backup = this.backups.find(
          (b: Backup) => b?.metadata?.name === name
        );

        if (!this.backup) {
          const response = (await this.axios.get(
            `${ApiRoutes.BACKUPS}/${namespace}/${name}`,
            {}
          )) as AxiosResponse;

          this.backup = response.data;
        }
      } catch (e) {
        this.backup = undefined;
        console.error(e);
      }
    },
    async fetch() {
      try {
        const response = (await this.axios.get(ApiRoutes.BACKUPS, {
          params: {
            offset: this.offset,
            limit: this.limit,
            search: this.filters.search,
          },
        })) as AxiosResponse;

        this.backups = response.data.items;
        this.total = response.data.total;
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
