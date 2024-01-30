import { BackupStatusPhase } from './backup.enums';

export interface Backup {
  apiVersion: string;
  kind: string;
  metadata: BackupMetadata;
  spec: BackupSpec;
  status: BackupStatus;
}

export interface BackupMetadata {
  annotations: object;
  creationTimestamp: string;
  generation: number;
  labels: object;
  managedFields: [];
  name: string;
  namespace: string;
  ownerReferences: BackupMetadataOwnerReference[];
  resourceVersion: string;
  uid: string;
}

export interface BackupMetadataOwnerReference {
  apiVersion: string;
  controller: boolean;
  kind: string;
  name: string;
  uid: string;
}

export interface BackupSpec {
  defaultVolumesToRestic: boolean;
  hooks: Hooks;
  includeClusterResources: boolean;
  includedNamespaces: string[];
  includedResources: string[];
  metadata: BackupSpecMetadata;
  snapshotVolumes: boolean;
  storageLocation: string;
  ttl: string;
  volumeSnapshotLocations: string[];
}

export interface Hooks {}

export interface BackupSpecMetadata {
  labels: object;
}

export interface BackupStatus {
  completionTimestamp: string;
  errors: number;
  expiration: string;
  formatVersion: string;
  phase: BackupStatusPhase;
  progress: BackupStatusProgress;
  startTimestamp: string;
  version: number;
  warnings: number;
}

export interface BackupStatusProgress {
  itemsBackedUp: number;
  totalItems: number;
}
