import type { Router, RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import { guard, resourceGuard } from '../utils/guard.utils';
import { Pages } from '../utils/constants.utils';
import { useListStore } from '../stores/list.store';
import { Resources } from '@velero-ui/velero';
import { Action } from '@velero-ui/shared-types';

const routes: Array<RouteRecordRaw> = [
  {
    component: import('@velero-ui-app/layouts/default/Default.vue'),
    redirect: Pages.LOGIN.path,
    path: '/',
    children: [
      {
        ...Pages.HOME,
        component: import('@velero-ui-app/views/Dashboard.vue'),
      },
      {
        ...Pages.BACKUPS,
        beforeEnter: () => resourceGuard(Action.Read, Resources.BACKUP.plural),
        children: [
          {
            path: '',
            component: import('@velero-ui-app/views/list/BackupList.vue'),
            beforeEnter: () => useListStore().setObjectType(Resources.BACKUP),
          },
          {
            ...Pages.BACKUP,
            component: import('@velero-ui-app/views/resources/Backup.vue'),
          },
        ],
      },
      {
        ...Pages.STORAGE_LOCATIONS,
        beforeEnter: () =>
          resourceGuard(Action.Read, Resources.BACKUP_STORAGE_LOCATION.plural),
        children: [
          {
            path: '',
            component: import(
              '@velero-ui-app/views/list/StorageLocationList.vue'
            ),
            beforeEnter: () =>
              useListStore().setObjectType(Resources.BACKUP_STORAGE_LOCATION),
          },
          {
            ...Pages.STORAGE_LOCATION,
            component: import(
              '@velero-ui-app/views/resources/StorageLocation.vue'
            ),
          },
        ],
      },
      {
        ...Pages.RESTORES,
        beforeEnter: () => resourceGuard(Action.Read, Resources.RESTORE.plural),
        children: [
          {
            path: '',
            component: import('@velero-ui-app/views/list/RestoreList.vue'),
            beforeEnter: () => useListStore().setObjectType(Resources.RESTORE),
          },
          {
            ...Pages.RESTORE,
            component: import('@velero-ui-app/views/resources/Restore.vue'),
          },
        ],
      },
      {
        ...Pages.SCHEDULES,
        beforeEnter: () =>
          resourceGuard(Action.Read, Resources.SCHEDULE.plural),
        children: [
          {
            path: '',
            component: import('@velero-ui-app/views/list/ScheduleList.vue'),
            beforeEnter: () => useListStore().setObjectType(Resources.SCHEDULE),
          },
          {
            ...Pages.SCHEDULE,
            component: import('@velero-ui-app/views/resources/Schedule.vue'),
          },
        ],
      },
      {
        ...Pages.SNAPSHOT_LOCATIONS,
        beforeEnter: () =>
          resourceGuard(Action.Read, Resources.VOLUME_SNAPSHOT_LOCATION.plural),
        children: [
          {
            path: '',
            component: import(
              '@velero-ui-app/views/list/SnapshotLocationList.vue'
            ),
            beforeEnter: () =>
              useListStore().setObjectType(Resources.VOLUME_SNAPSHOT_LOCATION),
          },
          {
            ...Pages.SNAPSHOT_LOCATION,
            component: import(
              '@velero-ui-app/views/resources/SnapshotLocation.vue'
            ),
          },
        ],
      },
      {
        ...Pages.BACKUP_REPOSITORIES,
        beforeEnter: () =>
          resourceGuard(Action.Read, Resources.BACKUP_REPOSITORY.plural),
        children: [
          {
            path: '',
            component: import(
              '@velero-ui-app/views/list/BackupRepositoryList.vue'
            ),
            beforeEnter: () =>
              useListStore().setObjectType(Resources.BACKUP_REPOSITORY),
          },
          {
            ...Pages.BACKUP_REPOSITORY,
            component: import(
              '@velero-ui-app/views/resources/BackupRepository.vue'
            ),
          },
        ],
      },
      {
        ...Pages.POD_VOLUME_BACKUPS,
        beforeEnter: () =>
          resourceGuard(Action.Read, Resources.POD_VOLUME_BACKUP.plural),
        children: [
          {
            path: '',
            component: import(
              '@velero-ui-app/views/list/PodVolumeBackupList.vue'
            ),
            beforeEnter: () =>
              useListStore().setObjectType(Resources.POD_VOLUME_BACKUP),
          },
          {
            ...Pages.POD_VOLUME_BACKUP,
            component: import('@velero-ui-app/views/resources/PodVolume.vue'),
          },
        ],
      },
      {
        ...Pages.POD_VOLUME_RESTORES,
        beforeEnter: () =>
          resourceGuard(Action.Read, Resources.POD_VOLUME_RESTORE.plural),
        children: [
          {
            path: '',
            component: import(
              '@velero-ui-app/views/list/PodVolumeRestoreList.vue'
            ),
            beforeEnter: () =>
              useListStore().setObjectType(Resources.POD_VOLUME_RESTORE),
          },
          {
            ...Pages.POD_VOLUME_RESTORE,
            component: import('@velero-ui-app/views/resources/PodVolume.vue'),
          },
        ],
      },
      {
        ...Pages.DOWNLOAD_REQUESTS,
        component: import('@velero-ui-app/views/list/DownloadRequestList.vue'),
        beforeEnter: () => {
          useListStore().setObjectType(Resources.DOWNLOAD_REQUEST);
          return resourceGuard(Action.Read, Resources.DOWNLOAD_REQUEST.plural);
        },
      },
      {
        ...Pages.SERVER_STATUS_REQUESTS,
        component: import(
          '@velero-ui-app/views/list/ServerStatusRequestList.vue'
        ),
        beforeEnter: () => {
          useListStore().setObjectType(Resources.SERVER_STATUS_REQUEST);
          return resourceGuard(
            Action.Read,
            Resources.SERVER_STATUS_REQUEST.plural
          );
        },
      },
      {
        ...Pages.DELETE_BACKUP_REQUESTS,
        component: import(
          '@velero-ui-app/views/list/DeleteBackupRequestList.vue'
        ),
        beforeEnter: () => {
          useListStore().setObjectType(Resources.DELETE_BACKUP_REQUEST);
          return resourceGuard(
            Action.Read,
            Resources.DELETE_BACKUP_REQUEST.plural
          );
        },
      },
      {
        ...Pages.SETTINGS,
        beforeEnter: () => resourceGuard(Action.Manage, 'all'),
        component: import('@velero-ui-app/views/Settings.vue'),
      },
    ],
  },
  {
    ...Pages.LOGIN,
    component: import('@velero-ui-app/layouts/auth/Auth.vue'),
  },
  {
    ...Pages.NOT_FOUND,
    component: import('@velero-ui-app/layouts/not-found/NotFound.vue'),
  },
];

const router: Router = createRouter({
  history: createWebHistory('/'),
  routes,
});

router.beforeEach(guard);

export default router;
