import { V1BackupSpec } from '@velero-ui/velero';
import { KubernetesObject } from '@kubernetes/client-node';

export interface V1Schedule extends KubernetesObject {
  spec: V1ScheduleSpec;
  status: V1ScheduleStatus;
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
