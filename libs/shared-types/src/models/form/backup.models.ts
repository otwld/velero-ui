import { V1BackupSpec } from '@velero-ui/velero';

export enum CreateBackupTypeEnum {
  FROM_SCHEDULE = 'schedule',
  FROM_SCRATCH = 'custom',
}

export interface CreateBackupDataFromScheduleBody {
  name: string;
}

export interface CreateBackupFormBody {
  name: string;
  type: CreateBackupTypeEnum;
  labels?: Record<string, string>;
  data: V1BackupSpec | CreateBackupDataFromScheduleBody;
}
