import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw, Router } from 'vue-router';
import Default from '../layouts/default/Default.vue';
import Auth from '../layouts/auth/Auth.vue';
import guard from '../utils/guard.utils';
import BackupList from '../views/BackupList.vue';
import NotFound from '../layouts/not-found/NotFound.vue';
import ScheduleList from '../views/ScheduleList.vue';
import RestoreList from '../views/RestoreList.vue';
import StorageLocationList from '../views/StorageLocationList.vue';
import Backup from '../views/Backup.vue';
import { Pages } from '../utils/constants.utils';
import SnapshotLocationList from '../views/SnapshotLocationList.vue';
import Settings from '../views/Settings.vue';
import Schedule from '../views/Schedule.vue';
import StorageLocation from '../views/StorageLocation.vue';
import SnapshotLocation from '../views/SnapshotLocation.vue';
import {useListStore} from "../stores/list.store";
import Dashboard from "../views/Dashboard.vue";
import DownloadRequestList from "@velero-ui-app/views/DownloadRequestList.vue";

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
            beforeEnter: () => useListStore().reset()
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
          },
          {
            ...Pages.STORAGE_LOCATION,
            component: StorageLocation,
          },
        ],
      },
      {
        ...Pages.RESTORES,
        component: RestoreList,
      },
      {
        ...Pages.SCHEDULES,
        children: [
          {
            path: '',
            component: ScheduleList,
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
          },
          {
            ...Pages.SNAPSHOT_LOCATION,
            component: SnapshotLocation,
          },
        ],
      },
      {
        ...Pages.BACKUP_REPOSITORIES,
        component: Dashboard,
      },
      {
        ...Pages.DOWNLOAD_REQUESTS,
        component: DownloadRequestList,
      },
      {
        ...Pages.SERVER_STATUS_REQUESTS,
        component: Dashboard,
      },
      {
        ...Pages.DELETE_BACKUP_REQUESTS,
        component: Dashboard,
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
   // linkActiveClass: "bg-gray-100 dark:bg-gray-700",
   // linkExactActiveClass: "bg-gray-100 dark:bg-gray-700",
  routes,
});

router.beforeEach(guard);

export default router;
