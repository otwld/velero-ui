import {
  V2alpha1DataUploadPhase,
  V2alpha1DataUploadSnapshotType,
  V1PodVolumeBackupPhase,
  NodeOS,
  V2alpha1DataDownloadPhase,
  type V2alpha1DataUpload,
  type V2alpha1DataDownload,
  type V1PodVolumeBackup,
} from '@velero-ui/velero';
export const upload = {
  kind: 'DataUpload',
  metadata: {
    name: 'upload',
    uid: 'upload-uid',
    labels: { 'velero.io/backup-name': 'daily' },
  },
  spec: {
    sourcePVC: 'database',
    snapshotType: V2alpha1DataUploadSnapshotType.CSI,
    operationTimeout: '10m',
    sourceNamespace: 'app',
    backupStorageLocation: 'default',
  },
  status: {
    phase: V2alpha1DataUploadPhase.InProgress,
    progress: { bytesDone: 25, totalBytes: 100 },
  },
} as V2alpha1DataUpload;
export const download = {
  kind: 'DataDownload',
  metadata: {
    name: 'download',
    uid: 'download-uid',
    labels: {
      'velero.io/restore-name': 'restore',
      'velero.io/restore-uid': 'restore-uid',
    },
  },
  spec: {
    sourceNamespace: 'app',
    operationTimeout: '10m',
    nodeOS: NodeOS.Linux,
    targetVolume: { pvc: 'database', pv: 'pv', namespace: 'restored' },
    snapshotID: 'id',
    backupStorageLocation: 'default',
  },
  status: { phase: V2alpha1DataDownloadPhase.Completed },
} as V2alpha1DataDownload;
export const filesystem = {
  kind: 'PodVolumeBackup',
  metadata: { name: 'filesystem', uid: 'fs-uid' },
  spec: {
    pod: { name: 'pod', namespace: 'app', kind: 'Pod', uuid: 'pod-uid' },
    repoIdentifier: 'repository',
    snapshotID: 'filesystem-snapshot',
    sourceNamespace: 'app',
    volume: 'data',
    tags: { backup: 'daily' },
    backupStorageLocation: 'default',
  },
  status: { phase: V1PodVolumeBackupPhase.Completed },
} as V1PodVolumeBackup;
