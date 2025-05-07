export interface Resource {
  name: string;
  kind: string;
  plural: string;
  route: string;
  subject: ResourcesNames;
}

export type ResourcesNames =
  | 'BACKUP'
  | 'RESTORE'
  | 'SCHEDULE'
  | 'DOWNLOAD_REQUEST'
  | 'DELETE_BACKUP_REQUEST'
  | 'POD_VOLUME_BACKUP'
  | 'POD_VOLUME_RESTORE'
  | 'BACKUP_REPOSITORY'
  | 'RESTIC_REPOSITORY'
  | 'BACKUP_STORAGE_LOCATION'
  | 'VOLUME_SNAPSHOT_LOCATION'
  | 'SERVER_STATUS_REQUEST';

export const PLURALS: string[] = [
  'backups',
  'restores',
  'schedules',
  'downloadrequests',
  'deletebackuprequests',
  'podvolumebackups',
  'podvolumerestores',
  'backuprepositories',
  'ResticRepository',
  'backupstoragelocations',
  'volumesnapshotlocations',
  'serverstatusrequests'
];

export const Resources: Record<ResourcesNames, Resource> = {
  BACKUP: {
    name: 'Backup',
    kind: 'Backup',
    plural: 'backups',
    route: '/backups',
    subject: 'BACKUP',
  },
  RESTORE: {
    name: 'Restore',
    kind: 'Restore',
    plural: 'restores',
    route: '/restores',
    subject: 'RESTORE',
  },
  SCHEDULE: {
    name: 'Schedule',
    kind: 'Schedule',
    plural: 'schedules',
    route: '/schedules',
    subject: 'SCHEDULE',
  },
  DOWNLOAD_REQUEST: {
    name: 'Download Request',
    kind: 'DownloadRequest',
    plural: 'downloadrequests',
    route: '/download-requests',
    subject: 'DOWNLOAD_REQUEST',
  },
  DELETE_BACKUP_REQUEST: {
    name: 'Delete backup Request',
    kind: 'DeleteBackupRequest',
    plural: 'deletebackuprequests',
    route: '/delete-backup-requests',
    subject: 'DELETE_BACKUP_REQUEST',
  },
  POD_VOLUME_BACKUP: {
    name: 'Pod Volume Backup',
    kind: 'PodVolumeBackup',
    plural: 'podvolumebackups',
    route: '/pod-volume-backups',
    subject: 'POD_VOLUME_BACKUP',
  },
  POD_VOLUME_RESTORE: {
    name: 'Pod Volume Restore',
    kind: 'PodVolumeRestore',
    plural: 'podvolumerestores',
    route: '/podvolumerestores',
    subject: 'POD_VOLUME_RESTORE',
  },
  BACKUP_REPOSITORY: {
    // >= v1.10.x
    name: 'Backup Repository',
    kind: 'BackupRepository',
    plural: 'backuprepositories',
    route: '/backup-repositories',
    subject: 'BACKUP_REPOSITORY',
  },
  RESTIC_REPOSITORY: {
    // < v1.10.x
    name: 'Restic Repository',
    kind: 'ResticRepository',
    plural: 'resticrepositories',
    route: '/restic-repositories',
    subject: 'RESTIC_REPOSITORY',
  },
  BACKUP_STORAGE_LOCATION: {
    name: 'backup Storage Location',
    kind: 'BackupStorageLocation',
    plural: 'backupstoragelocations',
    route: '/backup-storage-locations',
    subject: 'BACKUP_STORAGE_LOCATION',
  },
  VOLUME_SNAPSHOT_LOCATION: {
    name: 'Volume Snapshot Location',
    kind: 'VolumeSnapshotLocation',
    plural: 'volumesnapshotlocations',
    route: '/volume-snapshot-locations',
    subject: 'VOLUME_SNAPSHOT_LOCATION',
  },
  SERVER_STATUS_REQUEST: {
    name: 'Server Status Request',
    kind: 'ServerStatusRequest',
    plural: 'serverstatusrequests',
    route: '/server-status-requests',
    subject: 'SERVER_STATUS_REQUEST',
  },
};
