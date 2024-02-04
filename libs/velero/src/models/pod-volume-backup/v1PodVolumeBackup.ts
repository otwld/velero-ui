import { KubernetesObject, V1Pod } from '@kubernetes/client-node';
import { V1DataMoveOperationProgress } from '../shared/shared';

export interface V1PodVolumeBackup extends KubernetesObject {
  spec: V1PodVolumeBackupSpec;
  status: V1PodVolumeBackupStatus;
}

export interface V1PodVolumeBackupSpec {
  node: string;
  pod: V1Pod;
  backupStorageLocation: string;
  repoIdentifier: string;
  uploaderType?: string;
  tags?: Record<string, string>;
  uploaderSettings?: Record<string, string>;
}

export const enum V1PodVolumeBackupPhase {
  New = 'New',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Failed = 'Failed',
}

export interface V1PodVolumeBackupStatus {
  phase: V1PodVolumeBackupPhase;
  path?: string;
  message?: string;
  startTimestamp?: Date;
  completionTimestamp?: Date;
  progress?: V1DataMoveOperationProgress;
}
