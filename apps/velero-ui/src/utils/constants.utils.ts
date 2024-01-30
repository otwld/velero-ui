export const ApiRoutes = {
  BACKUPS: '/backups',
  SCHEDULES: '/schedules',
  STORAGE_LOCATIONS: '/storage-locations',
  RESTORES: '/restores',
  SNAPSHOT_LOCATIONS: '/snapshot-locations',
  SETTINGS_CLUSTER: '/settings/cluster',
  SETTINGS_VELERO_SERVER: '/settings/velero/server',
  SETTINGS_VELERO_AGENTS: '/settings/velero/agents',
  SETTINGS_VELERO_UI: '/settings/velero/ui',
};

export const Pages = {
  HOME: { name: 'Home', path: '/' },
  LOGIN: { name: 'Login', path: '/login' },
  BACKUPS: { name: 'Backups', path: '/backups' },
  BACKUP: { name: 'Backup', path: '/backups/:namespace/:name' },
  SCHEDULES: { name: 'Schedules', path: '/schedules' },
  STORAGE_LOCATIONS: { name: 'Storage locations', path: '/storage-locations' },
  RESTORES: { name: 'Restores', path: '/restores' },
  SNAPSHOT_LOCATIONS: {
    name: 'Snapshot Locations',
    path: '/snapshot-locations',
  },
  SETTINGS: {
    name: 'Settings',
    path: '/settings',
  },
  NOT_FOUND: { name: 'Not Found', path: '/:pathMatch(.*)*' },
};
