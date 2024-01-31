import { V1ObjectMeta } from '@kubernetes/client-node/dist/gen/model/v1ObjectMeta';

export interface V1Backup {
  apiVersion: string;
  kind: string;
  metadata: V1ObjectMeta;
  spec: V1BackupSpec;
  status: V1BackupStatus;
}

export interface V1BackupSpec {
  metadata?: V1BackupSpecMetadata;
  includedNamespaces?: string[];
  excludedNamespaces?: string[];
  includedResources?: string[];
  excludedResources?: string[];
  includedClusterScopedResources?: string[];
  excludedClusterScopedResources?: string[];
  includedNamespaceScopedResources?: string[];
  excludedNamespaceScopedResources?: string[];
  labelSelector?: object;
  orLabelSelectors?: object;
  snapshotVolumes?: boolean;
  ttl?: string;
  includeClusterResources?: boolean;
  hooks?: V1BackupHooks;
  storageLocation?: string;
  volumeSnapshotLocations?: string[];
  defaultVolumesToRestic?: boolean;
  defaultVolumesToFsBackup?: boolean;
  orderedResources?: Record<string, string>;
  csiSnapshotTimeout?: string;
  itemOperationTimeout?: string;
  snapshotMoveData?: string;
  datamover?: string;
  uploaderConfig?: string;
}

export interface V1BackupSpecMetadata {
  metadata?: Record<string, string>;
}

export interface V1BackupHooks {
  resources?: V1BackupHookSpec[];
}

export interface V1BackupHookSpec {
  name: string;
  includedNamespaces?: string[];
  excludedNamespaces?: string[];
  includedResources?: string[];
  excludedResources?: string[];
  labelSelector?: object;
  pre?: V1BackupResourceHook[];
  post?: V1BackupResourceHook[];
}

export interface V1BackupResourceHook {
  exec: V1BackupExecHook;
}

export interface V1BackupExecHook {
  container?: string;
  command: string;
  onError?: string;
  timeout?: string;
}

export const enum V1BackupStatusPhase {
  New = 'New',
  FailedValidation = 'FailedValidation',
  InProgress = 'InProgress',
  WaitingForPluginOperations = 'WaitingForPluginOperations',
  WaitingForPluginOperationsPartiallyFailed = 'WaitingForPluginOperationsPartiallyFailed',
  Finalizing = 'Finalizing',
  FinalizingPartiallyFailed = 'FinalizingPartiallyFailed',
  Completed = 'Completed',
  PartiallyFailed = 'PartiallyFailed',
  Failed = 'Failed',
  Deleting = 'Deleting',
}

export interface V1BackupStatus {
  version?: number;
  formatVersion?: string;
  expiration?: Date;
  phase?: V1BackupStatusPhase;
  validationErrors?: string[];
  startTimestamp?: string;
  completionTimestamp?: string;
  volumeSnapshotsAttempted?: Date;
  volumeSnapshotsCompleted?: Date;
  failureReason?: string;
  warnings?: number;
  errors?: number;
  progress?: V1BackupStatusProgress;
  csiVolumeSnapshotsAttempted?: number;
  csiVolumeSnapshotsCompleted?: number;
  backupItemOperationsAttempted?: number;
  backupItemOperationsCompleted?: number;
  backupItemOperationsFailed?: number;
  hookStatus?: V1BackupStatusHookStatus;
}

export interface V1BackupStatusProgress {
  totalItems?: number;
  itemsBackedUp?: number;
}

export interface V1BackupStatusHookStatus {
  hooksAttempted?: number;
  hooksFailed?: number;
}
