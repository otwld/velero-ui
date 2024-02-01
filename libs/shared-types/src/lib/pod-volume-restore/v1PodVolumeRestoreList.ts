import { V1ListMeta } from '@kubernetes/client-node';
import { V1PodVolumeRestore } from './v1PodVolumeRestore';

export interface V1PodVolumeRestoreList {
  apiVersion: string;
  total?: number;
  items: V1PodVolumeRestore[];
  kind: string;
  metadata: V1ListMeta;
}
