import { KubernetesObject } from '@kubernetes/client-node';
import { V1ObjectMeta } from '@kubernetes/client-node/dist/api';
import { V1Metadata } from '../shared';

export interface V1DeleteBackupRequest extends KubernetesObject {
  metadata?: V1ObjectMeta & V1Metadata;
  spec?: V1DeleteBackupRequestSpec;
  status?: V1DeleteBackupRequestStatus;
}

export interface V1DeleteBackupRequestSpec {
  backupName: string;
}

export enum V1DeleteBackupRequestPhase {
  New = 'New',
  InProgress = 'InProgress',
  Processed = 'Processed',
}

export interface V1DeleteBackupRequestStatus {
  phase: V1DeleteBackupRequestPhase;
  errors?: string[];
}
