import { V1ListMeta } from '@kubernetes/client-node';
import { V1Schedule } from './v1Schedule';

export interface V1ScheduleList {
  apiVersion: string;
  total?: number;
  items: V1Schedule[];
  kind: string;
  metadata: V1ListMeta;
}
