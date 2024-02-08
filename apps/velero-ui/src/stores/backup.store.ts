import { defineStore } from 'pinia';

import { ApiRoutes } from '../utils/constants.utils';
import type { AxiosResponse } from 'axios';
import type { V1Backup } from '@velero-ui/velero';
import { V1BackupPhase } from '@velero-ui/velero';

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
    set(backup: V1Backup): void {
      this.backup = backup;
    },
    setMany(backups: V1Backup[], total?: number): void {
      this.backups = backups;
      if (total) {
        this.total = total;
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
    delete(name: string): void {
      if (this.backup?.status) {
        this.backup.status.phase = V1BackupPhase.Deleting;
      }

      if (this.backups.length > 0) {
        const backup = this.schedules.find(
          (b: V1Backup): boolean => b?.metadata?.name === name
        );

        if (backup?.status) {
          backup.status.phase = V1BackupPhase.Deleting;
        }
      }
    },
    next(): void {
      if (this.offset + this.limit < this.total) {
        this.offset += 20;
      }
    },
    previous(): void {
      this.offset -= 20;

      if (this.offset < 0) {
        this.offset = 0;
      }
    },
    applyNameFilter(name: string): void {
      this.offset = 0;
      this.filters.search = name;
    },
  },
});
