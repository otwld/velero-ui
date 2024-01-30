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

const routes: Array<RouteRecordRaw> = [
  {
    component: Default,
    ...Pages.HOME,
    children: [
      {
        ...Pages.BACKUPS,
        children: [
          {
            path: '',
            component: BackupList,
          },
          {
            ...Pages.BACKUP,
            component: Backup,
          },
        ],
      },
      {
        ...Pages.STORAGE_LOCATIONS,
        component: StorageLocationList,
      },
      {
        ...Pages.RESTORES,
        component: RestoreList,
      },
      {
        ...Pages.SCHEDULES,
        component: ScheduleList,
      },
      {
        ...Pages.SNAPSHOT_LOCATIONS,
        component: SnapshotLocationList,
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
