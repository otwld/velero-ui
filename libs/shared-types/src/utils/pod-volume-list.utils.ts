import { Resources, type Resource, type V1Restore } from '@velero-ui/velero';
import { Filter, SortBy, SortDirection } from '../enums';
import type {
  Search,
  SearchFilters,
  FilterSelect,
} from '../models/search/search.models';
import type {
  PodVolumeListItem,
  VolumeOperation,
} from '../models/list/pod-volume-list.models';
export function podVolumeListItem(
  operation: VolumeOperation,
  resource: Resource,
  restores: V1Restore[] = []
): PodVolumeListItem {
  const backup = [
    Resources.POD_VOLUME_BACKUP.plural,
    Resources.DATA_UPLOAD.plural,
  ].includes(resource.plural);
  const spec = operation.spec;
  const owner = operation.metadata?.ownerReferences?.find(
    (reference) => reference.kind === (backup ? 'Backup' : 'Restore')
  );
  const parentLabel =
    operation.metadata?.labels?.[
      backup ? 'velero.io/backup-name' : 'velero.io/restore-name'
    ];
  const restoreUID = operation.metadata?.labels?.['velero.io/restore-uid'];
  const restore = backup
    ? undefined
    : restores.find((item) =>
        restoreUID
          ? item.metadata?.uid === restoreUID
          : item.metadata?.name === (owner?.name || parentLabel)
      );
  const parentName = restore?.metadata?.name || owner?.name || parentLabel;
  const tags = spec && 'tags' in spec ? spec.tags : undefined;
  return {
    apiVersion: operation.apiVersion,
    kind: operation.kind || resource.kind,
    metadata: operation.metadata,
    operation,
    resource,
    parentName: parentName || (backup ? tags?.['backup'] : undefined),
    backupName:
      (backup ? parentName : restore?.spec?.backupName) ||
      tags?.['backup'] ||
      operation.metadata?.labels?.['velero.io/backup-name'],
    namespace:
      spec &&
      ('sourcePVC' in spec
        ? spec.sourceNamespace
        : 'targetVolume' in spec
          ? spec.targetVolume?.namespace
          : spec.pod?.namespace),
    volumeName:
      spec &&
      ('sourcePVC' in spec
        ? spec.sourcePVC
        : 'targetVolume' in spec
          ? spec.targetVolume?.pvc
          : spec.volume),
    storageLocation: spec?.backupStorageLocation,
    phase: operation.status?.phase,
    dataMover: [
      Resources.DATA_UPLOAD.plural,
      Resources.DATA_DOWNLOAD.plural,
    ].includes(resource.plural),
  };
}

const values = (item: PodVolumeListItem) => ({
  [Filter.Backup]: item.backupName,
  [Filter.StorageLocation]: item.storageLocation,
  [Filter.Status]: item.phase,
});

export function filterPodVolumeList(
  items: PodVolumeListItem[],
  search: Search
) {
  const filterTypes = [
    Filter.Backup,
    Filter.StorageLocation,
    Filter.Status,
  ] as const;
  const matches = (item: PodVolumeListItem, ignored?: Filter) => {
    const text = search.search?.toLowerCase();
    if (
      text &&
      ![
        item.metadata?.name,
        item.parentName,
        item.backupName,
        item.namespace,
        item.volumeName,
      ].some((value) => value?.toLowerCase().includes(text))
    )
      return false;
    return filterTypes.every(
      (type) =>
        type === ignored ||
        !search[type] ||
        (type === Filter.Status
          ? search[type].split(',').includes(values(item)[type] || '')
          : search[type] === values(item)[type])
    );
  };
  const availableFilters: SearchFilters<FilterSelect[]> = {};
  for (const type of filterTypes) {
    const options = [
      ...new Set(
        items
          .map((item) => values(item)[type])
          .filter((value): value is string => !!value)
      ),
    ].sort();
    const enabled = new Set(
      items
        .filter((item) => matches(item, type))
        .map((item) => values(item)[type])
    );
    availableFilters[type] = options.map((value) => ({
      value,
      disabled: !enabled.has(value),
    }));
  }
  const filtered = items.filter((item) => matches(item));
  const direction = search.sortDirection === SortDirection.Descending ? -1 : 1;
  filtered.sort((a, b) => {
    const value = (item: PodVolumeListItem) =>
      search.sortBy === SortBy.StorageLocation
        ? item.storageLocation
        : item.metadata?.name;
    return (
      direction * (value(a) || '').localeCompare(value(b) || '') ||
      a.resource.plural.localeCompare(b.resource.plural)
    );
  });
  return {
    items: search.limit
      ? filtered.slice(search.offset || 0, (search.offset || 0) + search.limit)
      : filtered,
    total: filtered.length,
    filters: availableFilters,
  };
}
