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
}

export const useBackupStore = defineStore({
  id: 'backup',
  state: () =>
    ({
      backups: [],
      backup: undefined,
      backupLogs: undefined,
    } as BackupStore),
  actions: {
    set(backup: V1Backup): void {
      this.backup = backup;
    },
    setMany(backups: V1Backup[]): void {
      this.backups = backups;
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
        const backup = this.backups.find(
          (b: V1Backup): boolean => b?.metadata?.name === name
        );

        if (backup?.status) {
          backup.status.phase = V1BackupPhase.Deleting;
        }
      }
    },
  },
});
