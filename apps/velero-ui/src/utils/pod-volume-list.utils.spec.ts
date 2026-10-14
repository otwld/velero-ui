import { describe, expect, it } from 'vitest';
import { Resources, type V1Restore } from '@velero-ui/velero';
import { Filter, SortBy, SortDirection } from '@velero-ui/shared-types';
import {
  filterPodVolumeList,
  podVolumeDetailRoute,
  podVolumeListItem,
  podVolumeResourceForRoute,
} from './pod-volume-list.utils';
import { Pages } from './constants.utils';

import { upload, download, filesystem } from './pod-volume-list.fixtures';

describe('mixed pod volume menus', () => {
  it('projects uploads with their source PVC instead of expecting a pod spec', () => {
    expect(podVolumeListItem(upload, Resources.DATA_UPLOAD)).toMatchObject({
      parentName: 'daily',
      backupName: 'daily',
      namespace: 'app',
      volumeName: 'database',
      phase: 'InProgress',
      dataMover: true,
    });
  });
  it('projects downloads with the target namespace and original backup', () => {
    const restore = {
      metadata: { name: 'restore', uid: 'restore-uid' },
      spec: { backupName: 'daily' },
    } as V1Restore;
    expect(
      podVolumeListItem(download, Resources.DATA_DOWNLOAD, [restore])
    ).toMatchObject({
      parentName: 'restore',
      backupName: 'daily',
      namespace: 'restored',
      volumeName: 'database',
      dataMover: true,
    });
  });
  it('preserves filesystem volumes and pending mover resources', () => {
    expect(
      podVolumeListItem(filesystem, Resources.POD_VOLUME_BACKUP)
    ).toMatchObject({
      backupName: 'daily',
      volumeName: 'data',
      dataMover: false,
    });
    expect(
      podVolumeListItem({ ...upload, status: undefined }, Resources.DATA_UPLOAD)
        .phase
    ).toBeUndefined();
  });
  it('filters, sorts and paginates both sources together', () => {
    const items = [
      podVolumeListItem(upload, Resources.DATA_UPLOAD),
      podVolumeListItem(filesystem, Resources.POD_VOLUME_BACKUP),
    ];
    const result = filterPodVolumeList(items, {
      [Filter.Backup]: 'daily',
      sortBy: SortBy.Name,
      sortDirection: SortDirection.Ascending,
      limit: 1,
    });
    expect(result.total).toBe(2);
    expect(result.items[0].metadata.name).toBe('filesystem');
    expect(result.filters[Filter.Status].map((item) => item.value)).toEqual([
      'Completed',
      'InProgress',
    ]);
    expect(
      filterPodVolumeList(items, { [Filter.Status]: 'Completed' }).items
    ).toHaveLength(1);
    expect(
      filterPodVolumeList(items, { [Filter.Status]: 'Completed,InProgress' })
        .total
    ).toBe(2);
    expect(
      filterPodVolumeList(items, { search: 'database' }).items[0].resource
    ).toBe(Resources.DATA_UPLOAD);
  });
  it('distinguishes filesystem and mover details even when names collide', () => {
    expect(podVolumeDetailRoute(Resources.DATA_UPLOAD, 'same')).toEqual({
      name: Pages.POD_VOLUME_BACKUP.name,
      params: { name: 'same' },
      query: { resource: 'datauploads' },
    });
    expect(podVolumeDetailRoute(Resources.DATA_DOWNLOAD, 'same')).toEqual({
      name: Pages.POD_VOLUME_RESTORE.name,
      params: { name: 'same' },
      query: { resource: 'datadownloads' },
    });
    expect(
      podVolumeDetailRoute(Resources.POD_VOLUME_BACKUP, 'same').query
    ).toEqual({});
    expect(podVolumeResourceForRoute(true, 'datauploads')).toBe(
      Resources.DATA_UPLOAD
    );
    expect(podVolumeResourceForRoute(false, 'datadownloads')).toBe(
      Resources.DATA_DOWNLOAD
    );
    expect(podVolumeResourceForRoute(false, 'datauploads')).toBeUndefined();
  });
});
