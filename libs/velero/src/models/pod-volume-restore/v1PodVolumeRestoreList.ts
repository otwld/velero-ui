import { KubernetesListObject } from '@kubernetes/client-node/dist/types';
import { V1PodVolumeRestore } from './v1PodVolumeRestore';

export interface V1PodVolumeRestoreList
  extends KubernetesListObject<V1PodVolumeRestore> {
  total?: number;
}
