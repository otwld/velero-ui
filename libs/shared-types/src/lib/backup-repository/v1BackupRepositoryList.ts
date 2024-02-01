import { V1ListMeta } from '@kubernetes/client-node';
import { V1BackupRepository } from './v1BackupRepository';

export interface V1BackupRepositoryList {
  apiVersion: string;
  total?: number;
  items: V1BackupRepository[];
  kind: string;
  metadata: V1ListMeta;
}
