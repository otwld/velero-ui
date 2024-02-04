import { V1ListMeta } from '@kubernetes/client-node';
import { V1ServerStatusRequest } from './v1ServerStatusRequest';

export interface V1ServerStatusRequestType {
  apiVersion: string;
  total?: number;
  items: V1ServerStatusRequest[];
  kind: string;
  metadata: V1ListMeta;
}
