export interface Log {
  date: string;
  level: string;
  message: string;
  raw: string;
}

export interface VeleroLog extends Log {
  logSource?: string;
  controller?: string;
  backup?: string;
  cmd?: string;
  id?: string;
  plugin?: string;
  backupStorageLocation?: string;
  volumeSnapshotLocation?: string;
  backupRepository?: string;
  deleteBackupRequest?: string;
  serverStatusRequest?: string;
  downloadRequest?: string;
  expiration?: string;
  error?: string;
  podVolumeBackup?: string;
  podVolumeRestore?: string;
  namespace?: string;
  resource?: string;
  group?: string;
  name?: string;
}
