import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw, Router } from 'vue-router';
import Default from '../layouts/default/Default.vue';
import Auth from '../layouts/auth/Auth.vue';
import guard from '../utils/guard.utils';
import BackupList from '@velero-ui-app/views/list/BackupList.vue';
import NotFound from '../layouts/not-found/NotFound.vue';
import ScheduleList from '@velero-ui-app/views/list/ScheduleList.vue';
import RestoreList from '@velero-ui-app/views/list/RestoreList.vue';
import StorageLocationList from '@velero-ui-app/views/list/StorageLocationList.vue';
import Backup from '@velero-ui-app/views/ressources/Backup.vue';
import { Pages } from '../utils/constants.utils';
import SnapshotLocationList from '@velero-ui-app/views/list/SnapshotLocationList.vue';
import Settings from '../views/Settings.vue';
import Schedule from '@velero-ui-app/views/ressources/Schedule.vue';
import StorageLocation from '@velero-ui-app/views/ressources/StorageLocation.vue';
import SnapshotLocation from '@velero-ui-app/views/ressources/SnapshotLocation.vue';
import { useListStore } from '../stores/list.store';
import Dashboard from '../views/Dashboard.vue';
import DownloadRequestList from '@velero-ui-app/views/list/DownloadRequestList.vue';
import ServerStatusRequestList from '@velero-ui-app/views/list/ServerStatusRequestList.vue';
import DeleteBackupRequestList from '@velero-ui-app/views/list/DeleteBackupRequestList.vue';
import BackupRepositoryList from '@velero-ui-app/views/list/BackupRepositoryList.vue';
import BackupRepository from '@velero-ui-app/views/ressources/BackupRepository.vue';

const routes: Array<RouteRecordRaw> = [
  {
    component: Default,
    children: [
      {
        ...Pages.HOME,
        component: Dashboard,
      },
      {
        ...Pages.BACKUPS,
        children: [
          {
            path: '',
            component: BackupList,
            beforeEnter: () => useListStore().reset(),
          },
          {
            ...Pages.BACKUP,
            component: Backup,
          },
        ],
      },
      {
        ...Pages.STORAGE_LOCATIONS,
        children: [
          {
            path: '',
            component: StorageLocationList,
            beforeEnter: () => useListStore().reset(),
          },
          {
            ...Pages.STORAGE_LOCATION,
            component: StorageLocation,
          },
        ],
      },
      {
        ...Pages.RESTORES,
        children: [
          {
            path: '',
            component: RestoreList,
            beforeEnter: () => useListStore().reset(),
          },
          {
            ...Pages.RESTORE,
            component: Dashboard,
          },
        ],
      },
      {
        ...Pages.SCHEDULES,
        children: [
          {
            path: '',
            component: ScheduleList,
            beforeEnter: () => useListStore().reset(),
          },
          {
            ...Pages.SCHEDULE,
            component: Schedule,
          },
        ],
      },
      {
        ...Pages.SNAPSHOT_LOCATIONS,
        children: [
          {
            path: '',
            component: SnapshotLocationList,
            beforeEnter: () => useListStore().reset(),
          },
          {
            ...Pages.SNAPSHOT_LOCATION,
            component: SnapshotLocation,
          },
        ],
      },
      {
        ...Pages.BACKUP_REPOSITORIES,
        children: [
          {
            path: '',
            component: BackupRepositoryList,
            beforeEnter: () => useListStore().reset(),
          },
          {
            ...Pages.BACKUP_REPOSITORY,
            component: BackupRepository,
          },
        ],
      },
      {
        ...Pages.DOWNLOAD_REQUESTS,
        component: DownloadRequestList,
        beforeEnter: () => useListStore().reset(),
      },
      {
        ...Pages.SERVER_STATUS_REQUESTS,
        component: ServerStatusRequestList,
        beforeEnter: () => useListStore().reset(),
      },
      {
        ...Pages.DELETE_BACKUP_REQUESTS,
        component: DeleteBackupRequestList,
        beforeEnter: () => useListStore().reset(),
      },
      {
        ...Pages.SETTINGS,
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
