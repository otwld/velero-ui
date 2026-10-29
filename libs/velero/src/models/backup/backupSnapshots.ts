import type { KubernetesObject } from '@kubernetes/client-node';

/** CSI objects are also stored in Velero's downloadable backup metadata. */
export interface BackupCSISnapshot extends KubernetesObject {
  spec?: {
    source?: { persistentVolumeClaimName?: string };
    volumeSnapshotClassName?: string;
  };
  status?: {
    boundVolumeSnapshotContentName?: string;
    readyToUse?: boolean;
    restoreSize?: string;
    error?: { message?: string };
  };
}

export interface BackupCSISnapshotContent extends KubernetesObject {
  spec?: {
    driver?: string;
    source?: { snapshotHandle?: string };
    volumeSnapshotRef?: { name?: string; namespace?: string };
  };
  status?: {
    snapshotHandle?: string;
    restoreSize?: number;
    readyToUse?: boolean;
    error?: { message?: string };
  };
}

export interface BackupNativeSnapshot {
  spec?: { persistentVolumeName?: string; location?: string };
  status?: { providerSnapshotID?: string; phase?: string };
}

export interface BackupSnapshot {
  name: string;
  namespace?: string;
  volume?: string;
  pvName?: string;
  snapshotDataMoved?: boolean;
  dataMoverSnapshotID?: string;
  type: 'CSI' | 'Native';
  phase: string;
  snapshotID?: string;
  contentName?: string;
  driver?: string;
  size?: number;
  message?: string;
}

/** Stored BackupVolumeInfos fields vary across Velero 1.13–1.18. */
export interface BackupVolumeInfo {
  pvcName?: string;
  pvcNamespace?: string;
  pvName?: string;
  backupMethod?: string;
  snapshotDataMoved?: boolean;
  skipped?: boolean;
  result?: string;
  csiSnapshotInfo?: {
    snapshotHandle?: string;
    size?: number;
    driver?: string;
    vscName?: string;
    ReadyToUse?: boolean;
  };
  nativeSnapshotInfo?: { snapshotHandle?: string; Phase?: string };
  snapshotDataMovementInfo?: {
    snapshotHandle?: string;
    size?: number;
    Phase?: string;
  };
}

export interface BackupSnapshotIssue {
  source: 'volumeInfos' | 'native' | 'csi';
  reason: 'unavailable' | 'error';
}

export interface BackupSnapshotsResult {
  items: BackupSnapshot[];
  issues: BackupSnapshotIssue[];
}
