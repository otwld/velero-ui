import { KubernetesObject } from '@kubernetes/client-node';

export interface V1VolumeSnapshotLocation extends KubernetesObject {
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
