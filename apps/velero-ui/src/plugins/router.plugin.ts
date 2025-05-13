import type { Router, RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import Default from '../layouts/default/Default.vue';
import Auth from '../layouts/auth/Auth.vue';
import { guard, resourceGuard } from '../utils/guard.utils';
import BackupList from '@velero-ui-app/views/list/BackupList.vue';
import NotFound from '../layouts/not-found/NotFound.vue';
import ScheduleList from '@velero-ui-app/views/list/ScheduleList.vue';
import RestoreList from '@velero-ui-app/views/list/RestoreList.vue';
import StorageLocationList from '@velero-ui-app/views/list/StorageLocationList.vue';
import Backup from '@velero-ui-app/views/resources/Backup.vue';
import { Pages } from '../utils/constants.utils';
import SnapshotLocationList from '@velero-ui-app/views/list/SnapshotLocationList.vue';
import Settings from '../views/Settings.vue';
import Schedule from '@velero-ui-app/views/resources/Schedule.vue';
import StorageLocation from '@velero-ui-app/views/resources/StorageLocation.vue';
import SnapshotLocation from '@velero-ui-app/views/resources/SnapshotLocation.vue';
import { useListStore } from '../stores/list.store';
import Dashboard from '@velero-ui-app/views/Dashboard.vue';
import Restore from '@velero-ui-app/views/resources/Restore.vue';
import DownloadRequestList from '@velero-ui-app/views/list/DownloadRequestList.vue';
import ServerStatusRequestList from '@velero-ui-app/views/list/ServerStatusRequestList.vue';
import DeleteBackupRequestList from '@velero-ui-app/views/list/DeleteBackupRequestList.vue';
import BackupRepositoryList from '@velero-ui-app/views/list/BackupRepositoryList.vue';
import BackupRepository from '@velero-ui-app/views/resources/BackupRepository.vue';
import PodVolumeRestoreList from '@velero-ui-app/views/list/PodVolumeRestoreList.vue';
import PodVolumeBackupList from '@velero-ui-app/views/list/PodVolumeBackupList.vue';
import PodVolume from '@velero-ui-app/views/resources/PodVolume.vue';
import { Resources } from '@velero-ui/velero';
import { Action } from '@velero-ui/shared-types';

const routes: Array<RouteRecordRaw> = [
  {
    component: Default,
    redirect: Pages.LOGIN.path,
    path: '/',
    children: [
      {
        ...Pages.HOME,
        component: Dashboard,
      },
      {
        ...Pages.BACKUPS,
        beforeEnter: () => resourceGuard(Action.Read, Resources.BACKUP.plural),
        children: [
          {
            path: '',
            component: BackupList,
            beforeEnter: () => useListStore().setObjectType(Resources.BACKUP),
          },
          {
            ...Pages.BACKUP,
            component: Backup,
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
            component: StorageLocationList,
            beforeEnter: () =>
              useListStore().setObjectType(Resources.BACKUP_STORAGE_LOCATION),
          },
          {
            ...Pages.STORAGE_LOCATION,
            component: StorageLocation,
          },
        ],
      },
      {
        ...Pages.RESTORES,
        beforeEnter: () =>
          resourceGuard(Action.Read, Resources.RESTORE.plural),
        children: [
          {
            path: '',
            component: RestoreList,
            beforeEnter: () => useListStore().setObjectType(Resources.RESTORE),
          },
          {
            ...Pages.RESTORE,
            component: Restore,
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
            component: ScheduleList,
            beforeEnter: () => useListStore().setObjectType(Resources.SCHEDULE),
          },
          {
            ...Pages.SCHEDULE,
            component: Schedule,
          },
        ],
      },
      {
        ...Pages.SNAPSHOT_LOCATIONS,
        beforeEnter: () =>
          resourceGuard(
            Action.Read,
            Resources.VOLUME_SNAPSHOT_LOCATION.plural
          ),
        children: [
          {
            path: '',
            component: SnapshotLocationList,
            beforeEnter: () =>
              useListStore().setObjectType(Resources.VOLUME_SNAPSHOT_LOCATION),
          },
          {
            ...Pages.SNAPSHOT_LOCATION,
            component: SnapshotLocation,
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
            component: BackupRepositoryList,
            beforeEnter: () =>
              useListStore().setObjectType(Resources.BACKUP_REPOSITORY),
          },
          {
            ...Pages.BACKUP_REPOSITORY,
            component: BackupRepository,
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
            component: PodVolumeBackupList,
            beforeEnter: () =>
              useListStore().setObjectType(Resources.POD_VOLUME_BACKUP),
          },
          {
            ...Pages.POD_VOLUME_BACKUP,
            component: PodVolume,
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
            component: PodVolumeRestoreList,
            beforeEnter: () =>
              useListStore().setObjectType(Resources.POD_VOLUME_RESTORE),
          },
          {
            ...Pages.POD_VOLUME_RESTORE,
            component: PodVolume,
          },
        ],
      },
      {
        ...Pages.DOWNLOAD_REQUESTS,
        component: DownloadRequestList,
        beforeEnter: () => {
          useListStore().setObjectType(Resources.DOWNLOAD_REQUEST);
          return resourceGuard(Action.Read, Resources.DOWNLOAD_REQUEST.plural);
        },
      },
      {
        ...Pages.SERVER_STATUS_REQUESTS,
        component: ServerStatusRequestList,
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
        component: DeleteBackupRequestList,
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
        component: Settings,
      },
    ],
  },
  {
    ...Pages.LOGIN,
    component: Auth,
  },
  {
    ...Pages.NOT_FOUND,
    component: NotFound,
  },
];

const router: Router = createRouter({
  history: createWebHistory('/'),
  routes,
});

router.beforeEach(guard);

export default router;
