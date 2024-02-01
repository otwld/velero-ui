import { V1ObjectMeta } from '@kubernetes/client-node/dist/gen/model/v1ObjectMeta';

export interface V1BackupRepository {
  apiVersion: string;
  kind: string;
  metadata: V1ObjectMeta;
  spec: V1BackupRepositorySpec;
  status: V1BackupRepositoryStatus;
}

export interface V1BackupRepositorySpec {
  volumeNamespace: string;
  backupStorageLocation: string;
  repositoryType?: string;
  resticIdentifier: string;
  maintenanceFrequency: Date;
}

export const enum V1BackupRepositoryStatus {
  New = 'New',
  Ready = 'Ready',
  NotReady = 'NotReady',
  restic = 'restic',
  kopia = 'kopia',
}

export interface V1BackupRepositoryStatus {
  phase: V1BackupRepositoryStatus;
  message: string;
  lastMaintenanceTime: Date;
}
