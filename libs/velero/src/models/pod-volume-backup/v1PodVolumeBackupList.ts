import { V1ListMeta } from '@kubernetes/client-node';
import { V1PodVolumeBackup } from './v1PodVolumeBackup';

export interface V1PodVolumeBackupList {
  apiVersion: string;
  total?: number;
  items: V1PodVolumeBackup[];
  kind: string;
  metadata: V1ListMeta;
}
