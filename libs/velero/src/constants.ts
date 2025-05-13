export const ResourceList = [
  'BACKUP',
  'RESTORE',
  'SCHEDULE',
  'DOWNLOAD_REQUEST',
  'DELETE_BACKUP_REQUEST',
  'POD_VOLUME_BACKUP',
  'POD_VOLUME_RESTORE',
  'BACKUP_REPOSITORY',
  'RESTIC_REPOSITORY',
  'BACKUP_STORAGE_LOCATION',
  'VOLUME_SNAPSHOT_LOCATION',
  'SERVER_STATUS_REQUEST',
] as const;


export interface Resource {
  name: string;
  kind: string;
  plural: PluralsNames;
  route: string;
}

export type ResourcesNames = typeof ResourceList[number];

export const PLURALS = [
  'backups',
  'restores',
  'schedules',
  'downloadrequests',
  'deletebackuprequests',
  'podvolumebackups',
  'podvolumerestores',
  'backuprepositories',
  'resticrepositories',
  'backupstoragelocations',
  'volumesnapshotlocations',
  'serverstatusrequests'
] as const;

export type PluralsNames = typeof PLURALS[number];

export const Resources: Record<ResourcesNames, Resource> = {
  BACKUP: {
    name: 'Backup',
    kind: 'Backup',
    plural: 'backups',
    route: '/backups',
  },
  RESTORE: {
    name: 'Restore',
    kind: 'Restore',
    plural: 'restores',
    route: '/restores',
  },
  SCHEDULE: {
    name: 'Schedule',
    kind: 'Schedule',
    plural: 'schedules',
    route: '/schedules',
  },
  DOWNLOAD_REQUEST: {
    name: 'Download Request',
    kind: 'DownloadRequest',
    plural: 'downloadrequests',
    route: '/download-requests',
  },
  DELETE_BACKUP_REQUEST: {
    name: 'Delete backup Request',
    kind: 'DeleteBackupRequest',
    plural: 'deletebackuprequests',
    route: '/delete-backup-requests',
  },
  POD_VOLUME_BACKUP: {
    name: 'Pod Volume Backup',
    kind: 'PodVolumeBackup',
    plural: 'podvolumebackups',
    route: '/pod-volume-backups',
  },
  POD_VOLUME_RESTORE: {
    name: 'Pod Volume Restore',
    kind: 'PodVolumeRestore',
    plural: 'podvolumerestores',
    route: '/podvolumerestores',
  },
  BACKUP_REPOSITORY: {
    // >= v1.10.x
    name: 'Backup Repository',
    kind: 'BackupRepository',
    plural: 'backuprepositories',
    route: '/backup-repositories',
  },
  RESTIC_REPOSITORY: {
    // < v1.10.x
    name: 'Restic Repository',
    kind: 'ResticRepository',
    plural: 'resticrepositories',
    route: '/restic-repositories',
  },
  BACKUP_STORAGE_LOCATION: {
    name: 'Backup Storage Location',
    kind: 'BackupStorageLocation',
    plural: 'backupstoragelocations',
    route: '/backup-storage-locations',
  },
  VOLUME_SNAPSHOT_LOCATION: {
    name: 'Volume Snapshot Location',
    kind: 'VolumeSnapshotLocation',
    plural: 'volumesnapshotlocations',
    route: '/volume-snapshot-locations',
  },
  SERVER_STATUS_REQUEST: {
    name: 'Server Status Request',
    kind: 'ServerStatusRequest',
    plural: 'serverstatusrequests',
    route: '/server-status-requests',
  },
};
