import { V1ObjectMeta } from '@kubernetes/client-node/dist/gen/model/v1ObjectMeta';
import { V1BackupSpec } from '@velero-ui/shared-types';

export interface V1Schedule {
  apiVersion: string;
  kind: string;
  metadata: V1ObjectMeta;
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
