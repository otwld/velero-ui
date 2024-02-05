import { KubernetesObject } from '@kubernetes/client-node';
import { V1ObjectMeta } from '@kubernetes/client-node/dist/api';
import { V1Metadata } from '../shared';

export interface V1DownloadRequest extends KubernetesObject {
  metadata?: V1ObjectMeta & V1Metadata;
  spec?: V1DownloadRequestSpec;
  status?: V1DownloadRequestStatus;
}

export interface V1DownloadRequestSpec {
  target: V1DownloadTarget;
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
  kind: V1DownloadTargetKind;
}

export interface V1DownloadRequestStatus {
  phase: V1DownloadRequestPhase;
  downloadURL: string;
  expiration: Date;
}
