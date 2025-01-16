export enum CreateBackupTypeEnum {
  FROM_SCHEDULE = 'schedule',
  FROM_SCRATCH = 'custom',
}

export interface CreateBackupScheduleBody {
  name: string;
}
