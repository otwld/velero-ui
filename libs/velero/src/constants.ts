export const Ressources = {
  BACKUP: {
    kind: 'Backup',
    plurial: 'backups',
  },
  RESTORE: {
    kind: 'Restore',
    plurial: 'restores',
  },
  SCHEDULE: {
    kind: 'Schedule',
    plurial: 'schedules',
  },
  DOWNLOAD_REQUEST: {
    kind: 'DownloadRequest',
    plurial: 'downloadrequests',
  },
  DELETE_BACKUP_REQUEST: {
    kind: 'DeleteBackupRequest',
    plurial: 'deletebackuprequests',
  },
  POD_VOLUME_BACKUP: {
    kind: 'PodVolumeBackup',
    plurial: 'podvolumebackups',
  },
  POD_VOLUME_RESTORE: {
    kind: 'PodVolumeRestore',
    plurial: 'podvolumerestores',
  },
  BACKUP_REPOSITORY: { // >= v1.10.x
    kind: 'BackupRepository',
    plurial: 'backuprepositories',
  },
  RESTIC_REPOSITORY: { // < v1.10.x
    kind: 'ResticRepository',
    plurial: 'resticrepositories',
  },
  BACKUP_STORAGE_LOCATION: {
    kind: 'BackupStorageLocation',
    plurial: 'backupstoragelocations',
  },
  VOLUME_SNAPSHOT_LOCATION: {
    kind: 'VolumeSnapshotLocation',
    plurial: 'volumesnapshotlocations',
  },
  SERVER_STATUS_REQUEST: {
    kind: 'ServerStatusRequest',
    plurial: 'serverstatusrequests',
  },
};
