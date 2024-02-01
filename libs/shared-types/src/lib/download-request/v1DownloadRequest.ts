import { V1ObjectMeta } from '@kubernetes/client-node/dist/gen/model/v1ObjectMeta';

export interface V1DownloadRequest {
  apiVersion: string;
  kind: string;
  metadata: V1ObjectMeta;
  spec: V1DownloadRequestSpec;
  status: V1DownloadRequestStatus;
}

export interface V1DownloadRequestSpec {
  target: V1DownloadTarget;
  kind: V1DownloadTargetKind;
}

export const enum V1DownloadTargetKind {
  BackupLog = 'BackupLog',
  BackupContents = 'BackupContents',
  BackupVolumeSnapshots = 'BackupVolumeSnapshots',
  BackupItemOperations = 'BackupItemOperations',
  BackupResourceList = 'BackupResourceList',
  BackupResults = 'BackupResults',
  RestoreLog = 'RestoreLog',
  RestoreResults = 'RestoreResults',
  RestoreResourceList = 'RestoreResourceList',
  RestoreItemOperations = 'RestoreItemOperations',
  CSIBackupVolumeSnapshots = 'CSIBackupVolumeSnapshots',
  CSIBackupVolumeSnapshotContents = 'CSIBackupVolumeSnapshotContents',
  BackupVolumeInfos = 'BackupVolumeInfos',
}

export const enum V1DownloadRequestPhase {
  New = 'New',
  Processed = 'Processed',
}

export interface V1DownloadTarget {
  name: string;
}

export interface V1DownloadRequestStatus {
  phase: V1DownloadRequestPhase;
  downloadURL: string;
  expiration: Date;
}
