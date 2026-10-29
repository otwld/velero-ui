import type {
  NodeOS,
  V1DataMoveOperationProgress,
  V1Metadata,
} from '@velero-ui/velero';
import type { KubernetesObject, V1ObjectMeta } from '@kubernetes/client-node';

export interface V2alpha1DataDownload extends KubernetesObject {
  metadata?: V1ObjectMeta & V1Metadata;
  spec: V2Alpha1DataDownloadSpec;
  status?: V2Alpha1DataDownloadStatus;
}

export interface V2Alpha1DataDownloadSpec {
  targetVolume: V2Alpha1DataDownloadTargetVolumeSpec;
  backupStorageLocation: string;
  datamover?: string;
  snapshotID: string;
  sourceNamespace: string;
  dataMoverConfig?: object;
  cancel?: boolean;
  operationTimeout: string;
  nodeOS: NodeOS;
}

export interface V2Alpha1DataDownloadTargetVolumeSpec {
  pvc: string;
  pv: string;
  namespace: string;
}

export enum V2alpha1DataDownloadPhase {
  New = 'New',
  Accepted = 'Accepted',
  Prepared = 'Prepared',
  InProgress = 'InProgress',
  Canceling = 'Canceling',
  Canceled = 'Canceled',
  Completed = 'Completed',
  Failed = 'Failed',
}

export interface V2Alpha1DataDownloadStatus {
  phase?: V2alpha1DataDownloadPhase;
  message?: string;
  startTimestamp?: string;
  completionTimestamp?: string;
  progress?: V1DataMoveOperationProgress;
  node?: string;
  acceptedByNode?: string;
  acceptedTimestamp?: string;
}
