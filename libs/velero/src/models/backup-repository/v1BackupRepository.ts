import {KubernetesObject} from "@kubernetes/client-node";

export interface V1BackupRepository extends KubernetesObject {
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

export const enum V1BackupRepositoryPhase {
  New = 'New',
  Ready = 'Ready',
  NotReady = 'NotReady',
  restic = 'restic',
  kopia = 'kopia',
}

export interface V1BackupRepositoryStatus {
  phase: V1BackupRepositoryPhase;
  message: string;
  lastMaintenanceTime: Date;
}
