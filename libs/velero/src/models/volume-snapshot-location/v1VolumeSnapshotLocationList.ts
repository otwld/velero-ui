import { V1VolumeSnapshotLocation } from './v1VolumeSnapshotLocation';
import { KubernetesListObject } from '@kubernetes/client-node/dist/types';

export interface V1VolumeSnapshotLocationList
  extends KubernetesListObject<V1VolumeSnapshotLocation> {
  total?: number;
}
