import { KubernetesObject } from '@kubernetes/client-node';
import { V1ObjectMeta } from '@kubernetes/client-node/dist/api';
import { V1Metadata } from '../shared';

export interface V1VolumeSnapshotLocation extends KubernetesObject {
  metadata?: V1ObjectMeta & V1Metadata;
  spec: V1VolumeSnapshotLocationSpec;
  status: V1VolumeSnapshotLocationStatus;
}

export const enum V1VolumeSnapshotLocationPhase {
  Available = 'Available',
  Unavailable = 'Unavailable',
}

export interface V1VolumeSnapshotLocationSpec {
  provider: string;
  config: Record<string, string>;
  credential: string;
}

export interface V1VolumeSnapshotLocationStatus {
  phase?: V1VolumeSnapshotLocationPhase;
}
