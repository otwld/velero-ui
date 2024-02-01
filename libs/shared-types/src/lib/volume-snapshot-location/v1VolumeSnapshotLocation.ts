import { V1ObjectMeta } from '@kubernetes/client-node/dist/gen/model/v1ObjectMeta';

export interface V1VolumeSnapshotLocation {
  apiVersion: string;
  kind: string;
  metadata: V1ObjectMeta;
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
