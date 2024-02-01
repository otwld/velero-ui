import { V1ObjectMeta } from '@kubernetes/client-node/dist/gen/model/v1ObjectMeta';

export interface V1DeleteBackupRequest {
  apiVersion: string;
  kind: string;
  metadata: V1ObjectMeta;
  spec: V1DeleteBackupRequestSpec;
  status: V1DeleteBackupRequestStatus;
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
