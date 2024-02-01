import { V1ListMeta } from '@kubernetes/client-node';
import { V1DeleteBackupRequest } from './v1DeleteBackupRequest';

export interface V1DeleteBackupRequestList {
  apiVersion: string;
  total?: number;
  items: V1DeleteBackupRequest[];
  kind: string;
  metadata: V1ListMeta;
}
