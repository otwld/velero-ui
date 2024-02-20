import type { V1BackupRepository } from '@velero-ui/velero';
import { defineStore } from 'pinia';

export interface BackupRepositoryStore {
  repositories: V1BackupRepository[];
  repository: V1BackupRepository;
}

export const useBackupRepositoryStore = defineStore({
  id: 'backup-repository',
  state: () =>
    ({
      repositories: [],
      repository: undefined,
    } as BackupRepositoryStore),
  getters: {},
  actions: {
    set(repository: V1BackupRepository): void {
      this.repository = repository;
    },
    setMany(repositories: V1BackupRepository[]): void {
      this.repositories = repositories;
    },
    delete(name: string): void {
      if (this.repository) {
        this.repository = undefined;
      }

      if (this.repositories.length > 0) {
        this.repositories = this.repositories.filters(
          (repository: V1BackupRepository): boolean =>
            repository?.metadata?.name === name
        );
      }
    },
  },
});
