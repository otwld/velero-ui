import { KubernetesListObject } from '@kubernetes/client-node/dist/types';
import { V1PodVolumeBackup } from '../pod-volume-backup';

export interface V1PodVolumeRestoreList
  extends KubernetesListObject<V1PodVolumeBackup> {
  total?: number;
}
