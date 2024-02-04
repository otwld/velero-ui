import { KubernetesObject } from '@kubernetes/client-node';

export interface V1DeleteBackupRequest extends KubernetesObject {
  spec?: V1DeleteBackupRequestSpec;
  status?: V1DeleteBackupRequestStatus;
}

export interface V1DeleteBackupRequestSpec {
  backupName: string;
}

export const enum V1DeleteBackupRequestPhase {
  New = 'New',
  InProgress = 'InProgress',
  Processed = 'Processed',
}

export interface V1DeleteBackupRequestStatus {
  phase: V1DeleteBackupRequestPhase;
  errors?: string[];
}
