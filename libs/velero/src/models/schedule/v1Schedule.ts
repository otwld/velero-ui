import { V1BackupSpec, V1Metadata } from '@velero-ui/velero';
import { KubernetesObject } from '@kubernetes/client-node';
import { V1ObjectMeta } from '@kubernetes/client-node/dist/api';

export interface V1Schedule extends KubernetesObject {
  metadata?: V1ObjectMeta & V1Metadata;
  spec?: V1ScheduleSpec;
  status?: V1ScheduleStatus;
}

export interface V1ScheduleSpec {
  template: V1BackupSpec;
  schedule: string;
  useOwnerReferencesInBackup?: boolean;
  paused?: boolean;
  skipImmediately?: boolean;
}

export const enum V1SchedulePhase {
  New = 'New',
  Enabled = 'Enabled',
  FailedValidation = 'FailedValidation',
}

export interface V1ScheduleStatus {
  phase?: V1SchedulePhase;
  lastBackup?: Date;
  lastSkipped?: Date;
  validationErrors: string[];
}
