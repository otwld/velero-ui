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
  maintenanceFrequency: Date;
}

export const enum V1BackupRepositoryPhase {
  New = 'New',
  Ready = 'Ready',
  NotReady = 'NotReady',
}

export const enum V1BackupRepositoryType {
  Restic = 'restic',
  Kopia = 'kopia',
}

export interface V1BackupRepositoryStatus {
  phase: V1BackupRepositoryPhase;
  message: string;
  lastMaintenanceTime: string;
}
