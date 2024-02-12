import { V1DeleteBackupRequest } from './v1DeleteBackupRequest';
import { KubernetesListObject } from '@kubernetes/client-node/dist/types';

export interface V1DeleteBackupRequestList
  extends KubernetesListObject<V1DeleteBackupRequest> {
  total?: number;
}
