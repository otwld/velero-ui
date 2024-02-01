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
  SCHEDULE: { name: 'Schedule', path: '/schedules/:namespace/:name' },
  STORAGE_LOCATIONS: { name: 'Storage locations', path: '/storage-locations' },
  STORAGE_LOCATION: {
    name: 'Storage location',
    path: '/storage-locations/:namespace/:name',
  },
  RESTORES: { name: 'Restores', path: '/restores' },
  RESTORE: { name: 'Restore', path: '/restores/:namespace/:name' },
  SNAPSHOT_LOCATIONS: {
    name: 'Snapshot Locations',
    path: '/snapshot-locations',
  },
  SNAPSHOT_LOCATION: {
    name: 'Snapshot Location',
    path: '/snapshot-locations/:namespace/:name',
  },
  SETTINGS: {
    name: 'Settings',
    path: '/settings',
  },
  NOT_FOUND: { name: 'Not Found', path: '/:pathMatch(.*)*' },
};
