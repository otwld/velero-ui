import type { StorageLocation } from '@velero-ui/shared-types';
import { defineStore } from 'pinia';
import { ApiRoutes } from '../utils/constants.utils';
import type { AxiosResponse } from 'axios';

export interface StorageLocationSearchFilters {
  startWith: string;
}

export interface StorageLocationStore {
  locations: StorageLocation[];
  total: number;
  offset: number;
  limit: number;
  filters: StorageLocationSearchFilters;
}

export const useStorageLocationStore = defineStore({
  id: 'storage-location',
  state: () =>
    ({
      locations: [],
      total: 0,
      offset: 0,
      limit: 20,
      filters: {
        search: null,
      },
    } as StorageLocationStore),
  getters: {},
  actions: {
    async fetch() {
      try {
        const response = (await this.axios.get(ApiRoutes.STORAGE_LOCATIONS, {
          params: {
            offset: this.offset,
            limit: this.limit,
            search: this.filters.search,
          },
        })) as AxiosResponse;

        this.locations = response.data.items;
        this.total = response.data.total;
      } catch (e) {
        console.error(e);
      }
    },
    async delete(names: string[]) {
      try {
        const response = (await this.axios.delete(
          `${ApiRoutes.SCHEDULES}}`
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
