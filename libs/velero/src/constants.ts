export interface Resource {
  kind: string;
  plurial: string;
  route: string;
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

export const Resources: Record<ResourcesNames, Resource> = {
  BACKUP: {
    kind: 'Backup',
    plurial: 'backups',
    route: '/backups',
  },
  RESTORE: {
    kind: 'Restore',
    plurial: 'restores',
    route: '/restores',
  },
  SCHEDULE: {
    kind: 'Schedule',
    plurial: 'schedules',
    route: '/schedules',
  },
  DOWNLOAD_REQUEST: {
    kind: 'DownloadRequest',
    plurial: 'downloadrequests',
    route: '/download-requests',
  },
  DELETE_BACKUP_REQUEST: {
    kind: 'DeleteBackupRequest',
    plurial: 'deletebackuprequests',
    route: '/delete-backup-requests',
  },
  POD_VOLUME_BACKUP: {
    kind: 'PodVolumeBackup',
    plurial: 'podvolumebackups',
    route: '/pod-volume-backups',
  },
  POD_VOLUME_RESTORE: {
    kind: 'PodVolumeRestore',
    plurial: 'podvolumerestores',
    route: '/pod-volume-restores',
  },
  BACKUP_REPOSITORY: {
    // >= v1.10.x
    kind: 'BackupRepository',
    plurial: 'backuprepositories',
    route: '/backup-repositories',
  },
  RESTIC_REPOSITORY: {
    // < v1.10.x
    kind: 'ResticRepository',
    plurial: 'resticrepositories',
    route: '/restic-repositories',
  },
  BACKUP_STORAGE_LOCATION: {
    kind: 'BackupStorageLocation',
    plurial: 'backupstoragelocations',
    route: '/backup-storage-locations',
  },
  VOLUME_SNAPSHOT_LOCATION: {
    kind: 'VolumeSnapshotLocation',
    plurial: 'volumesnapshotlocations',
    route: '/volume-snapshot-locations',
  },
  SERVER_STATUS_REQUEST: {
    kind: 'ServerStatusRequest',
    plurial: 'serverstatusrequests',
    route: '/server-status-requests',
  },
};
