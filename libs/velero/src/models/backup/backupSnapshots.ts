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
  type: 'CSI' | 'Native';
  phase: string;
  snapshotID?: string;
  contentName?: string;
  driver?: string;
  size?: number;
  message?: string;
}
