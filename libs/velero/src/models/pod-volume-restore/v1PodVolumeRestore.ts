import { KubernetesObject } from '@kubernetes/client-node';
import {
  V1DataMoveOperationProgress,
  V1Metadata,
  V1VolumePod,
} from '../shared/shared';
import { V1ObjectMeta } from '@kubernetes/client-node/dist/api';
import {V1BackupRepositoryType} from "../backup-repository";

export interface V1PodVolumeRestore extends KubernetesObject {
  metadata?: V1ObjectMeta & V1Metadata;
  spec?: V1PodVolumeRestoreSpec;
  status?: V1PodVolumeRestoreStatus;
}

export interface V1PodVolumeRestoreSpec {
  node?: string;
  pod: V1VolumePod;
  volume: string;
  backupStorageLocation: string;
  repoIdentifier: string;
  uploaderType?: V1BackupRepositoryType;
  snapshotID: string;
  sourceNamespace: string;
  tags?: Record<string, string>;
  uploaderSettings?: Record<string, string>;
}

export enum V1PodVolumeRestorePhase {
  New = 'New',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Failed = 'Failed',
}

export interface V1PodVolumeRestoreStatus {
  phase: V1PodVolumeRestorePhase;
  message?: string;
  startTimestamp?: string;
  completionTimestamp?: string;
  progress?: V1DataMoveOperationProgress;
}
