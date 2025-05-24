import { KubernetesObject } from '@kubernetes/client-node';
import { V1ObjectMeta } from '@kubernetes/client-node/dist/api';
import { V1Metadata } from '../shared';

export interface V1BackupRepository extends KubernetesObject {
  metadata?: V1ObjectMeta & V1Metadata;
  spec?: V1BackupRepositorySpec;
  status?: V1BackupRepositoryStatus;
}

export interface V1BackupRepositorySpec {
  volumeNamespace: string;
  backupStorageLocation: string;
  repositoryType?: V1BackupRepositoryType;
  resticIdentifier: string;
  maintenanceFrequency: string;
  repositoryConfig?: object;
}

export enum V1BackupRepositoryPhase {
  New = 'New',
  Ready = 'Ready',
  NotReady = 'NotReady',
}

export enum V1BackupRepositoryType {
  Restic = 'restic',
  Kopia = 'kopia',
}

export enum V1BackupRepositoryMaintenanceResult {
  Succeeded = 'Succeeded',
  Failed = 'Failed',
}

export interface V1BackupRepositoryStatus {
  phase: V1BackupRepositoryPhase;
  message: string;
  lastMaintenanceTime: string;
  recentMaintenance: V1BackupRepositoryMaintenanceStatus[]
}

export interface V1BackupRepositoryMaintenanceStatus {
  result: V1BackupRepositoryMaintenanceResult;
  startTimestamp: Date;
  completionTimestamp: Date;
  message: string;
}
