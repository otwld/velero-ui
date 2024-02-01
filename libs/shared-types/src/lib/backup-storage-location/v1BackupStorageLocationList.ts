import { V1ListMeta } from '@kubernetes/client-node';
import { V1BackupStorageLocation } from './v1BackupStorageLocation';

export interface V1BackupStorageLocationList {
  apiVersion: string;
  total?: number;
  items: V1BackupStorageLocation[];
  kind: string;
  metadata: V1ListMeta;
}
