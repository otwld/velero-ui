import { V1PodVolumeBackup } from './v1PodVolumeBackup';
import { KubernetesListObject } from '@kubernetes/client-node/dist/types';

export interface V1PodVolumeBackupList
  extends KubernetesListObject<V1PodVolumeBackup> {
  total?: number;
}
