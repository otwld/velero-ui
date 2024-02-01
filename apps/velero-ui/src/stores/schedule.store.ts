import type { V1Schedule } from '@velero-ui/shared-types';
import { defineStore } from 'pinia';
import { ApiRoutes } from '../utils/constants.utils';
import type { AxiosResponse } from 'axios';

export interface ScheduleSearchFilters {
  startWith: string;
}

export interface ScheduleStore {
  schedules: V1Schedule[];
  schedule: V1Schedule;
  total: number;
  offset: number;
  limit: number;
  filters: ScheduleSearchFilters;
}

export const useScheduleStore = defineStore({
  id: 'schedule',
  state: () =>
    ({
      schedules: [],
      schedule: undefined,
      total: 0,
      offset: 0,
      limit: 20,
      filters: {
        search: null,
      },
    } as ScheduleStore),
  getters: {},
  actions: {
    async get(name: string, namespace: string) {
      try {
        this.schedule = this.schedules.find(
          (b: V1Schedule) => b?.metadata?.name === name
        );

        if (!this.schedule) {
          const response = (await this.axios.get(
            `${ApiRoutes.SCHEDULES}/${namespace}/${name}`,
            {}
          )) as AxiosResponse;

          this.schedule = response.data;
        }
      } catch (e) {
        this.schedule = undefined;
        console.error(e);
      }
    },
    async fetch() {
      try {
        const response = (await this.axios.get(ApiRoutes.SCHEDULES, {
          params: {
            offset: this.offset,
            limit: this.limit,
            search: this.filters.search,
          },
        })) as AxiosResponse;

        this.schedules = response.data.items;
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
