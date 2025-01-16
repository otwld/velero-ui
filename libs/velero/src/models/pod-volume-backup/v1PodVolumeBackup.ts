import { KubernetesObject } from '@kubernetes/client-node';
import {
  V1DataMoveOperationProgress,
  V1Metadata,
  V1VolumePod,
} from '../shared/shared';
import { V1ObjectMeta } from '@kubernetes/client-node/dist/api';
import { V1BackupRepositoryType } from '../backup-repository';

export interface V1PodVolumeBackup extends KubernetesObject {
  metadata?: V1ObjectMeta & V1Metadata;
  spec?: V1PodVolumeBackupSpec;
  status?: V1PodVolumeBackupStatus;
}

export interface V1PodVolumeBackupSpec {
  node?: string;
  volume: string;
  pod: V1VolumePod;
  backupStorageLocation: string;
  repoIdentifier: string;
  uploaderType?: V1BackupRepositoryType;
  snapshotID: string;
  sourceNamespace: string;
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
  startTimestamp?: string;
  completionTimestamp?: string;
  progress?: V1DataMoveOperationProgress;
}
