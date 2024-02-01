import { V1ObjectMeta } from '@kubernetes/client-node/dist/gen/model/v1ObjectMeta';
import { V1Pod } from '@kubernetes/client-node';
import { DataMoveOperationProgress } from '../shared/shared';

export interface V1PodVolumeRestore {
  apiVersion: string;
  kind: string;
  metadata: V1ObjectMeta;
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
  progress?: DataMoveOperationProgress;
}
