import { KubernetesObject } from '@kubernetes/client-node';
import { V1ObjectMeta } from '@kubernetes/client-node/dist/api';
import { V1Metadata } from '../shared';

export interface V1BackupStorageLocation extends KubernetesObject {
  metadata?: V1ObjectMeta & V1Metadata;
  spec?: V1BackupStorageLocationSpec;
  status?: V1BackupStorageLocationStatus;
}

export const enum V1BackupStorageLocationAccessMode {
  ReadOnly = 'ReadOnly',
  ReadWrite = 'ReadWrite',
}

export interface V1BackupStorageLocationSpec {
  provider: string;
  config?: Record<string, string>;
  credential?: object;
  // storageType?: V1BackupStorageLocationStorageType;
  objectStorage?: V1BackupStorageLocationObjectStorageLocation;
  default?: boolean;
  accessMode?: V1BackupStorageLocationAccessMode;
  backupSyncPeriod?: string;
  validationFrequency?: string;
}

export interface V1BackupStorageLocationStorageType {
  objectStorage: V1BackupStorageLocationObjectStorageLocation;
}

export interface V1BackupStorageLocationObjectStorageLocation {
  bucket: string;
  prefix?: string;
  caCert?: string;
}

export const enum V1BackupStorageLocationPhase {
  Available = 'Available',
  Unavailable = 'Unavailable',
}

export interface V1BackupStorageLocationStatus {
  phase?: V1BackupStorageLocationPhase;
  lastSyncedTime?: Date;
  lastValidationTime?: Date;
  message?: string;
  lastSyncedRevision?: string;
  accessMode?: V1BackupStorageLocationAccessMode;
}
