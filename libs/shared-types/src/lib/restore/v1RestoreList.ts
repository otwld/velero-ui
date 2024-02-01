import { V1ListMeta } from '@kubernetes/client-node';
import { V1Restore } from './v1Restore';

export interface V1RestoreList {
  apiVersion: string;
  total?: number;
  items: V1Restore[];
  kind: string;
  metadata: V1ListMeta;
}
