import { V1ServerStatusRequest } from './v1ServerStatusRequest';
import { KubernetesListObject } from '@kubernetes/client-node/dist/types';

export interface V1ServerStatusRequestList
  extends KubernetesListObject<V1ServerStatusRequest> {
  total?: number;
}
