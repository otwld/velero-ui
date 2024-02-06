import type { V1Schedule, V1ScheduleList } from '@velero-ui/velero';
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
    async get(name: string): Promise<V1Schedule> {
      try {
        this.schedule = this.schedules.find(
          (b: V1Schedule) => b?.metadata?.name === name
        );

        if (!this.schedule) {
          const response: AxiosResponse<V1Schedule> = await this.axios.get(
            `${ApiRoutes.SCHEDULES}/${name}`,
            {}
          );

          this.schedule = response.data;
        }
      } catch (e) {
        this.schedule = undefined;
        console.error(e);
      }
      return this.schedule;
    },

    async fetch(): Promise<V1Schedule[]> {
      try {
        const response: AxiosResponse<V1ScheduleList> = await this.axios.get(
          ApiRoutes.SCHEDULES,
          {
            params: {
              offset: this.offset,
              limit: this.limit,
              search: this.filters.search,
            },
          }
        );

        this.schedules = response.data.items;
        this.total = response.data.total;
      } catch (e) {
        this.schedules = [];
        this.total = 0;
        console.error(e);
      }
      return this.schedules;
    },

    togglePause(name: string, paused: boolean) {
      if (this.schedule?.spec) {
        this.schedule.spec.paused = paused;
      }

      if (this.schedules.length > 0) {
        const schedule = this.schedules.find(
          (s: V1Schedule): boolean => s?.metadata?.name === name
        );

        if (schedule?.spec) {
          schedule.spec.paused = paused;
        }
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
