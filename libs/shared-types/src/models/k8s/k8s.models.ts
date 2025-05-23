import {
  KubernetesListObject,
  KubernetesObject,
} from '@kubernetes/client-node/dist/types';
import { FilterSelect, SearchFilters } from '../search/search.models';

export interface KubernetesListObjectWithFilters<T extends KubernetesObject>
  extends KubernetesListObject<T> {
  total: number;
  filters?: SearchFilters<FilterSelect[]>;
}
