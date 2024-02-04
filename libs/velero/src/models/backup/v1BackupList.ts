import { V1Backup } from './v1Backup';
import { V1ListMeta } from '@kubernetes/client-node';

export interface V1BackupList {
  apiVersion: string;
  total?: number;
  items: V1Backup[];
  kind: string;
  metadata: V1ListMeta;
}
