import type {
  V1VolumeSnapshotLocation,
  V1VolumeSnapshotLocationList,
} from '@velero-ui/velero';
import { defineStore } from 'pinia';
import { ApiRoutes } from '../utils/constants.utils';
import type { AxiosResponse } from 'axios';

export interface SnapshotLocationSearchFilters {
  startWith: string;
}

export interface SnapshotLocationStore {
  locations: V1VolumeSnapshotLocation[];
  location: V1VolumeSnapshotLocation;
  total: number;
  offset: number;
  limit: number;
  filters: SnapshotLocationSearchFilters;
}

export const useSnapshotLocationStore = defineStore({
  id: 'snapshot-location',
  state: () =>
    ({
      locations: [],
      location: undefined,
      total: 0,
      offset: 0,
      limit: 20,
      filters: {
        search: null,
      },
    } as SnapshotLocationStore),
  getters: {},
  actions: {
    async get(name: string) {
      try {
        this.location = this.locations.find(
          (b: V1VolumeSnapshotLocation): boolean => b?.metadata?.name === name
        );

        if (!this.backup) {
          const response: AxiosResponse<V1VolumeSnapshotLocation> =
            (await this.axios.get(
              `${ApiRoutes.SNAPSHOT_LOCATIONS}/${name}`,
              {}
            )) as AxiosResponse<V1VolumeSnapshotLocation>;

          this.location = response.data;
        }
      } catch (e) {
        this.location = undefined;
        console.error(e);
      }
    },
    async fetch() {
      try {
        const response: AxiosResponse<V1VolumeSnapshotLocationList> =
          (await this.axios.get(ApiRoutes.SNAPSHOT_LOCATIONS, {
            params: {
              offset: this.offset,
              limit: this.limit,
              search: this.filters.search,
            },
          })) as AxiosResponse<V1VolumeSnapshotLocationList>;

        this.locations = response.data.items;
        this.total = response.data.total;
      } catch (e) {
        console.error(e);
      }
    },
    async delete(names: string[]) {
      try {
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
