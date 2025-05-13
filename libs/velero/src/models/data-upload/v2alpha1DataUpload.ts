import { KubernetesObject } from '@kubernetes/client-node';
import {
  NodeOS,
  V1DataMoveOperationProgress,
  V1Metadata,
} from '@velero-ui/velero';
import { V1ObjectMeta } from '@kubernetes/client-node/dist/api';

export interface V2alpha1DataUpload extends KubernetesObject {
  metadata?: V1ObjectMeta & V1Metadata;
  spec: V2alpha1DataUploadSpec;
  status: V2alpha1DataUploadStatus;
}

export interface V2alpha1DataUploadSpec {
  snapshotType: V2alpha1DataUploadSnapshotType;
  csiSnapshot: V2alpha1DataUploadCSISnapshotSpec;
  sourcePVC: string;
  datamover: string;
  backupStorageLocation: string;
  sourceNamespace: string;
  dataMoverConfig?: object;
  cancel: boolean;
  operationTimeout: Date;
}

export const enum V2alpha1DataUploadSnapshotType {
  CSI = 'CSI',
}

export interface V2alpha1DataUploadCSISnapshotSpec {
  volumeSnapshot: string;
  storageClass: string;
  snapshotClass: string;
}

export const enum V2alpha1DataUploadPhase {
  New = 'New',
  Accepted = 'Accepted',
  Prepared = 'Prepared',
  InProgress = 'InProgress',
  Canceling = 'Canceling',
  Canceled = 'Canceled',
  Completed = 'Completed',
  Failed = 'Failed',
}

export interface V2alpha1DataUploadStatus {
  phase: V2alpha1DataUploadPhase;
  path: string;
  snapshotID: string;
  dataMoverResult: object;
  message: string;
  startTimestamp: Date;
  completionTimestamp: Date;
  progress: V1DataMoveOperationProgress;
  node: string;
  nodeOS: NodeOS;
  acceptedByNode: string;
  acceptedTimestamp: Date;
}

export interface V2alpha1DataUploadResult {
  backupStorageLocation: string;
  datamover: string;
  snapshotID: string;
  sourceNamespace: string;
  dataMoverResult: object;
  nodeOS: NodeOS;
}
