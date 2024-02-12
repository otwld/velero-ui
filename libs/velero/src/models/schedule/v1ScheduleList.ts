import { V1Schedule } from './v1Schedule';
import { KubernetesListObject } from '@kubernetes/client-node/dist/types';

export interface V1ScheduleList extends KubernetesListObject<V1Schedule> {
  total?: number;
}
