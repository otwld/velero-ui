import { defineStore } from 'pinia';

import type { V1Restore } from '@velero-ui/velero';

export interface RestoreStore {
  restores: V1Restore[];
  restore: V1Restore;
}

export const useRestoreStore = defineStore({
  id: 'restore',
  state: () =>
    ({
      restores: [],
      restore: undefined,
    } as RestoreStore),
  actions: {
    set(restore: V1Restore): void {
      this.restore = restore;
    },
    setMany(restores: V1Restore[]): void {
      this.restores = restores;
    },
    delete(name: string): void {
      if (this.restore) {
        this.restore = undefined;
      }

      if (this.restores.length > 0) {
        this.restores = this.restores.filters(
          (restore: V1Restore): boolean => restore?.metadata?.name === name
        );
      }
    },
  },
});
