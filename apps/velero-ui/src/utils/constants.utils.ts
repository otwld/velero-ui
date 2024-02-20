export const ApiRoutes = {
  BACKUPS: '/backups',
  SCHEDULES: '/schedules',
  STORAGE_LOCATIONS: '/storage-locations',
  RESTORES: '/restores',
  BACKUP_REPOSITORIES: '/backup-repositories',
  SNAPSHOT_LOCATIONS: '/snapshot-locations',
  DOWNLOAD_REQUESTS: '/download-requests',
  SERVER_STATUS_REQUESTS: '/server-status-requests',
  DELETE_BACKUP_REQUESTS: '/delete-backup-requests',
  SETTINGS_CLUSTER: '/settings/cluster',
  SETTINGS_VELERO_SERVER: '/settings/velero/server',
  SETTINGS_VELERO_AGENTS: '/settings/velero/agents',
  SETTINGS_VELERO_UI: '/settings/velero/ui',
  SETTINGS_VELERO_PLUGINS: '/settings/velero/plugins',
};

export const Pages = {
  HOME: { name: 'Dashboard', path: '/dashboard' },
  LOGIN: { name: 'Login', path: '/login' },
  BACKUPS: { name: 'Backups', path: '/backups' },
  BACKUP: { name: 'Backup', path: '/backups/:name' },
  SCHEDULES: { name: 'Schedules', path: '/schedules' },
  SCHEDULE: { name: 'Schedule', path: '/schedules/:name' },
  STORAGE_LOCATIONS: { name: 'Storage Locations', path: '/storage-locations' },
  STORAGE_LOCATION: {
    name: 'Storage Location',
    path: '/storage-locations/:name',
  },
  BACKUP_REPOSITORIES: {
    name: 'Backup Repositories',
    path: '/backup-repositories',
  },
  BACKUP_REPOSITORY: {
    name: 'Backup Repository',
    path: '/backup-repositories/:name',
  },
  RESTORES: { name: 'Restores', path: '/restores' },
  RESTORE: { name: 'Restore', path: '/restores/:name' },
  SNAPSHOT_LOCATIONS: {
    name: 'Snapshot Locations',
    path: '/snapshot-locations',
  },
  SNAPSHOT_LOCATION: {
    name: 'Snapshot Location',
    path: '/snapshot-locations/:name',
  },
  DELETE_BACKUP_REQUESTS: {
    name: 'Delete Backup Requests',
    path: '/requests/delete-backup-requests',
  },
  DOWNLOAD_REQUESTS: {
    name: 'Download Requests',
    path: '/requests/download-requests',
  },
  SERVER_STATUS_REQUESTS: {
    name: 'Server Status Requests',
    path: '/requests/server-status-requests',
  },
  SETTINGS: {
    name: 'Settings',
    path: '/settings',
  },
  NOT_FOUND: { name: 'Not Found', path: '/:pathMatch(.*)*' },
};
