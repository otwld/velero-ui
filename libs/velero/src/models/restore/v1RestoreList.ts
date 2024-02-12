import { V1Restore } from './v1Restore';
import { KubernetesListObject } from '@kubernetes/client-node/dist/types';

export interface V1RestoreList extends KubernetesListObject<V1Restore> {
  total?: number;
}
