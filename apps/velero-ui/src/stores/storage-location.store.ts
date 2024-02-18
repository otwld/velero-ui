import type { V1BackupStorageLocation } from '@velero-ui/velero';
import { defineStore } from 'pinia';

export interface StorageLocationStore {
  locations: V1BackupStorageLocation[];
  location: V1BackupStorageLocation;
}

export const useStorageLocationStore = defineStore({
  id: 'storage-location',
  state: () =>
    ({
      locations: [],
      location: undefined,
    } as StorageLocationStore),
  getters: {},
  actions: {
    set(location: V1BackupStorageLocation): void {
      this.location = location;
    },
    setMany(locations: V1BackupStorageLocation[]): void {
      this.locations = locations;
    },
    delete(name: string): void {
      if (this.location) {
        this.location = undefined;
      }

      if (this.locations.length > 0) {
        this.locations = this.locations.filters(
          (location: V1BackupStorageLocation): boolean =>
            location?.metadata?.name === name
        );
      }
    },
  },
});
