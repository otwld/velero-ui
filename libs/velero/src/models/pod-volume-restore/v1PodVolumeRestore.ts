import { KubernetesObject, V1Pod } from '@kubernetes/client-node';
import { V1DataMoveOperationProgress } from '../shared/shared';

export interface V1PodVolumeRestore extends KubernetesObject {
  spec: V1PodVolumeRestoreSpec;
  status: V1PodVolumeRestoreStatus;
}

export interface V1PodVolumeRestoreSpec {
  pod: V1Pod;
  volume: string;
  backupStorageLocation: string;
  repoIdentifier: string;
  uploaderType?: string;
  snapshotID: string;
  sourceNamespace: string;
  uploaderSettings?: Record<string, string>;
}

export const enum V1PodVolumeRestorePhase {
  New = 'New',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Failed = 'Failed',
}

export interface V1PodVolumeRestoreStatus {
  phase: V1PodVolumeRestorePhase;
  message?: string;
  startTimestamp?: Date;
  completionTimestamp?: Date;
  progress?: V1DataMoveOperationProgress;
}
