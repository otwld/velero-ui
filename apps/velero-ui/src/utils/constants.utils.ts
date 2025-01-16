export const ApiRoutes = {
  AUTH: '/auth',
  BACKUPS: '/backups',
  SCHEDULES: '/schedules',
  STORAGE_LOCATIONS: '/storage-locations',
  RESTORES: '/restores',
  BACKUP_REPOSITORIES: '/backup-repositories',
  SNAPSHOT_LOCATIONS: '/snapshot-locations',
  DOWNLOAD_REQUESTS: '/download-requests',
  SERVER_STATUS_REQUESTS: '/server-status-requests',
  DELETE_BACKUP_REQUESTS: '/delete-backup-requests',
  STATS: '/stats',
  SETTINGS_CLUSTER: '/settings/cluster',
  SETTINGS_VELERO_SERVER: '/settings/velero/server',
  SETTINGS_VELERO_AGENTS: '/settings/velero/agents',
  SETTINGS_VELERO_UI: '/settings/velero/ui',
  SETTINGS_VELERO_PLUGINS: '/settings/velero/plugins',
  FORM_SCHEDULES: '/form/schedules',
  FORM_BACKUPS: '/form/backups',
  FORM_NAMESPACES: '/form/namespaces',
  FORM_SECRETS: '/form/secrets',
  FORM_CONFIG_MAPS: '/form/config-maps',
  FORM_STORAGE_LOCATIONS: '/form/storage-locations',
  FORM_SNAPSHOT_LOCATIONS: '/form/snapshot-locations',
};

export const Pages = {
  HOME: { name: 'Dashboard', path: '/dashboard' },
  LOGIN: { name: 'Login', path: '/login' },
  BACKUPS: { name: 'Backups', path: '/backups' },
  BACKUP: { name: 'Backup', path: '/backups/:name' },
  SCHEDULES: { name: 'Schedules', path: '/schedules' },
  SCHEDULE: { name: 'Schedule', path: '/schedules/:name' },
  STORAGE_LOCATIONS: { name: 'Storage Locations', path: '/backup-storage-locations' },
  STORAGE_LOCATION: {
    name: 'Storage Location',
    path: '/backup-storage-locations/:name',
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
    path: '/volume-snapshot-locations',
  },
  SNAPSHOT_LOCATION: {
    name: 'Snapshot Location',
    path: '/volume-snapshot-locations/:name',
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
  POD_VOLUME_BACKUPS: {
    name: 'Pod Volume Backups',
    path: '/pod-volumes/backups',
  },
  POD_VOLUME_BACKUP: {
    name: 'Pod Volume Backup',
    path: '/pod-volumes/backups/:name',
  },
  POD_VOLUME_RESTORES: {
    name: 'Pod Volume Restores',
    path: '/pod-volumes/restores',
  },
  POD_VOLUME_RESTORE: {
    name: 'Pod Volume Restore',
    path: '/pod-volumes/restores/:name',
  },
  SETTINGS: {
    name: 'Settings',
    path: '/settings',
  },
  NOT_FOUND: { name: 'Not Found', path: '/:pathMatch(.*)*' },
};
