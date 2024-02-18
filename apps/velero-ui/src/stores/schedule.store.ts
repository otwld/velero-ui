import type { V1Schedule } from '@velero-ui/velero';
import { defineStore } from 'pinia';

export interface ScheduleStore {
  schedules: V1Schedule[];
  schedule: V1Schedule;
}

export const useScheduleStore = defineStore({
  id: 'schedule',
  state: () =>
    ({
      schedules: [],
      schedule: undefined,
    } as ScheduleStore),
  getters: {},
  actions: {
    set(schedule: V1Schedule): void {
      this.schedule = schedule;
    },
    setMany(schedules: V1Schedule[]): void {
      this.schedules = schedules;
    },

    togglePause(name: string, paused: boolean): void {
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

    delete(name: string): void {
      if (this.schedule) {
        this.schedule = undefined;
      }

      if (this.schedules.length > 0) {
        this.schedules = this.schedules.filters(
          (schedule: V1Schedule): boolean => schedule?.metadata?.name === name
        );
      }
    },
  },
});
