import { V1Backup } from './v1Backup';
import { KubernetesListObject } from '@kubernetes/client-node/dist/types';

export interface V1BackupList extends KubernetesListObject<V1Backup> {
  total?: number;
}
