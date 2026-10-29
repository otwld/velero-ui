import { Resources, type Resource } from '@velero-ui/velero';
import { Pages } from './constants.utils';
export {
  podVolumeListItem,
  filterPodVolumeList,
} from '@velero-ui/shared-types';
export type { PodVolumeListItem } from '@velero-ui/shared-types';

export function podVolumeDetailRoute(resource: Resource, name: string) {
  const backup = [
    Resources.POD_VOLUME_BACKUP.plural,
    Resources.DATA_UPLOAD.plural,
  ].includes(resource.plural);
  const dataMover = [
    Resources.DATA_UPLOAD.plural,
    Resources.DATA_DOWNLOAD.plural,
  ].includes(resource.plural);
  return {
    name: backup ? Pages.POD_VOLUME_BACKUP.name : Pages.POD_VOLUME_RESTORE.name,
    params: { name },
    query: dataMover ? { resource: resource.plural } : {},
  };
}

export function podVolumeResourceForRoute(
  backup: boolean,
  plural?: string
): Resource | undefined {
  const filesystem = backup
    ? Resources.POD_VOLUME_BACKUP
    : Resources.POD_VOLUME_RESTORE;
  const mover = backup ? Resources.DATA_UPLOAD : Resources.DATA_DOWNLOAD;
  if (!plural || plural === filesystem.plural) return filesystem;
  return plural === mover.plural ? mover : undefined;
}
