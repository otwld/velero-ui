import { V1BackupStorageLocation } from './v1BackupStorageLocation';
import { KubernetesListObject } from '@kubernetes/client-node/dist/types';

export interface V1BackupStorageLocationList
  extends KubernetesListObject<V1BackupStorageLocation> {
  total?: number;
}
