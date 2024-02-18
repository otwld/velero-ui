import type {
  V1VolumeSnapshotLocation,
} from '@velero-ui/velero';
import { defineStore } from 'pinia';


export interface SnapshotLocationStore {
  locations: V1VolumeSnapshotLocation[];
  location: V1VolumeSnapshotLocation;
}

export const useSnapshotLocationStore = defineStore({
  id: 'snapshot-location',
  state: () =>
    ({
      locations: [],
      location: undefined,
    } as SnapshotLocationStore),
  getters: {},
  actions: {
    set(location: V1VolumeSnapshotLocation): void {
      this.location = location;
    },
    setMany(locations: V1VolumeSnapshotLocation[]): void {
      this.locations = locations;
    },
    delete(name: string): void {
      if (this.location) {
        this.location = undefined;
      }

      if (this.locations.length > 0) {
        this.locations = this.locations.filters(
          (location: V1VolumeSnapshotLocation): boolean => location?.metadata?.name === name
        );
      }
    },
  },
});
