import { KubernetesObject, V1ObjectMeta } from '@kubernetes/client-node';
import { V1Metadata } from '../shared';

export interface V1Backup extends KubernetesObject {
  metadata?: V1ObjectMeta & V1Metadata;
  spec?: V1BackupSpec;
  status?: V1BackupStatus;
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
  orLabelSelectors?: Record<string, string>;
  snapshotVolumes?: boolean;
  ttl?: string;
  volumeGroupSnapshotLabelKey?: string;
  includeClusterResources?: boolean;
  hooks?: V1BackupHooks;
  storageLocation?: string;
  volumeSnapshotLocations?: string[];
  defaultVolumesToRestic?: boolean;
  defaultVolumesToFsBackup?: boolean;
  orderedResources?: string[];
  csiSnapshotTimeout?: string;
  itemOperationTimeout?: string;
  snapshotMoveData?: boolean;
  datamover?: string;
  resourcePolicy?: object;
  uploaderConfig?: V1UploaderConfigForBackup;
}

export interface V1UploaderConfigForBackup {
  parallelFilesUpload?: number;
}

export interface V1BackupSpecMetadata {
  labels?: Record<string, string>;
}

export interface V1BackupHooks {
  resources?: V1BackupResourceHookSpec[];
}

export interface V1BackupResourceHookSpec {
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
  exec: V1ExecHook;
}

export enum V1HookErrorMode {
  Continue = 'Continue',
  Fail = 'Fail',
}

export interface V1ExecHook {
  container?: string;
  command: string;
  onError?: V1HookErrorMode;
  timeout?: string;
}

export enum V1BackupPhase {
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
  expiration?: string;
  phase?: V1BackupPhase;
  validationErrors?: string[];
  startTimestamp?: string;
  completionTimestamp?: string;
  volumeSnapshotsAttempted?: Date;
  volumeSnapshotsCompleted?: Date;
  failureReason?: string;
  warnings?: number;
  errors?: number;
  progress?: V1BackupProgress;
  csiVolumeSnapshotsAttempted?: number;
  csiVolumeSnapshotsCompleted?: number;
  backupItemOperationsAttempted?: number;
  backupItemOperationsCompleted?: number;
  backupItemOperationsFailed?: number;
  hookStatus?: V1HookStatus;
}

export interface V1BackupProgress {
  totalItems?: number;
  itemsBackedUp?: number;
}

export interface V1HookStatus {
  hooksAttempted?: number;
  hooksFailed?: number;
}
