import { V1HookErrorMode, V1HookStatus, V1Metadata } from '@velero-ui/velero';
import { KubernetesObject } from '@kubernetes/client-node';
import { V1ObjectMeta } from '@kubernetes/client-node/dist/api';

export interface V1Restore extends KubernetesObject {
  metadata?: V1ObjectMeta & V1Metadata;
  spec?: V1RestoreSpec;
  status?: V1RestoreStatus;
}

export interface V1RestoreSpec {
  backupName: string;
  scheduleName?: string;
  includedNamespaces?: string[];
  excludedNamespaces?: string[];
  includedResources?: string[];
  excludedResources?: string[];
  namespaceMapping?: Record<string, string>;
  labelSelector?: object;
  orLabelSelectors?: object;
  restorePVs?: boolean;
  restoreStatus?: V1RestoreStatusSpec;
  preserveNodePorts?: boolean;
  includeClusterResources?: boolean;
  hooks?: V1RestoreHooks;
  existingResourcePolicy?: V1PolicyType;
  itemOperationTimeout?: Date;
  resourceModifier?: object;
  uploaderConfig?: V1UploaderConfigForRestore;
}

export interface V1RestoreStatusSpec {
  includedResources?: string[];
  excludedResources?: string[];
}

export interface V1RestoreResourceHookSpec {
  name: string;
  includedNamespaces?: string[];
  excludedNamespaces?: string[];
  includedResources?: string[];
  excludedResources?: string[];
  labelSelector?: object;
  postHooks: V1RestoreResourceHook[];
}

export interface V1RestoreResourceHook {
  exec: V1ExecRestoreHook;
  init: V1InitRestoreHook;
}

export interface V1ExecRestoreHook {
  container?: string;
  command: string[];
  onError?: V1HookErrorMode;
  execTimeout?: Date;
  waitTimeout?: Date;
  waitForReady?: boolean;
}

export interface V1InitRestoreHook {
  initContainers?: [];
  timeout?: Date;
}

export interface V1RestoreHooks {
  resources: V1RestoreResourceHookSpec[];
}

export interface V1UploaderConfigForRestore {
  writeSparseFiles?: boolean;
}

export const enum V1PolicyType {
  none = 'none',
  update = 'update',
}

export const enum V1RestorePhase {
  New = 'New',
  FailedValidation = 'FailedValidation',
  InProgress = 'InProgress',
  WaitingForPluginOperations = 'WaitingForPluginOperations',
  WaitingForPluginOperationsPartiallyFailed = 'WaitingForPluginOperationsPartiallyFailed',
  Completed = 'Completed',
  PartiallyFailed = 'PartiallyFailed',
  Failed = 'Failed',
}

export interface V1RestoreStatus {
  phase?: V1RestorePhase;
  validationErrors?: string[];
  warnings: number;
  errors?: number;
  failureReason?: string;
  startTimestamp?: string;
  completionTimestamp?: string;
  progress?: V1RestoreProgress;
  restoreItemOperationsAttempted?: number;
  restoreItemOperationsCompleted?: number;
  restoreItemOperationsFailed?: number;
  hookStatus?: V1HookStatus;
}

export interface V1RestoreProgress {
  totalItems?: number;
  itemsRestored?: number;
}
