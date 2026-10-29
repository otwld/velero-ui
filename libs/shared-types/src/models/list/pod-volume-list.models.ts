import type { KubernetesObject } from '@kubernetes/client-node';
import type {
  Resource,
  V1PodVolumeBackup,
  V1PodVolumeRestore,
  V2alpha1DataUpload,
  V2alpha1DataDownload,
} from '@velero-ui/velero';
import type { SearchFilters, FilterSelect } from '../search/search.models';
export type VolumeOperation =
  | V1PodVolumeBackup
  | V1PodVolumeRestore
  | V2alpha1DataUpload
  | V2alpha1DataDownload;
export interface PodVolumeListItem extends KubernetesObject {
  operation: VolumeOperation;
  resource: Resource;
  parentName?: string;
  backupName?: string;
  namespace?: string;
  volumeName?: string;
  storageLocation?: string;
  phase?: string;
  dataMover: boolean;
}

export interface PodVolumeListPermissions {
  filesystem: boolean;
  mover: boolean;
  restores: boolean;
}
export interface PodVolumeListPage {
  items: PodVolumeListItem[];
  total: number;
  filters: SearchFilters<FilterSelect[]>;
  offset: number;
  limit: number;
  issues: { plural: string }[];
}
