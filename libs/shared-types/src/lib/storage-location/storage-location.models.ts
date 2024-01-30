import { StorageLocationStatusPhase } from './storage-location.enums';

export interface StorageLocation {
  apiVersion: string;
  kind: string;
  metadata: StorageLocationMetadata;
  spec: StorageLocationSpec;
  status: StorageLocationStatus;
}

export interface StorageLocationMetadata {
  annotations: object;
  creationTimestamp: string;
  generation: number;
  labels: object;
  managedFields: any[];
  name: string;
  namespace: string;
  resourceVersion: string;
  uid: string;
}

export interface StorageLocationSpec {
  config: object;
  default: boolean;
  objectStorage: ObjectStorage;
  provider: string;
}

export interface ObjectStorage {
  bucket: string;
}

export interface StorageLocationStatus {
  lastSyncedTime: string;
  lastValidationTime: string;
  phase: StorageLocationStatusPhase;
  message: string;
}
