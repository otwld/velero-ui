import { V1ListMeta } from '@kubernetes/client-node';
import { V1VolumeSnapshotLocation } from './v1VolumeSnapshotLocation';

export interface V1VolumeSnapshotLocationList {
  apiVersion: string;
  total?: number;
  items: V1VolumeSnapshotLocation[];
  kind: string;
  metadata: V1ListMeta;
}
