import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { V1BackupSpec, V1ScheduleSpec } from '@velero-ui/velero';
import { type CreateFormBody, EditFormBody } from '@velero-ui/shared-types';
import { CreateBackupScratchDto } from '@velero-ui-api/shared/dto/backup.dto';

export class CreateScheduleSpecDto implements V1ScheduleSpec {
  @IsObject()
  @ValidateNested()
  @Type(() => CreateBackupScratchDto)
  template: V1BackupSpec;

  @IsNotEmpty()
  @IsString()
  schedule: string;

  @IsOptional()
  @IsBoolean()
  useOwnerReferencesInBackup?: boolean = true;

  @IsOptional()
  @IsBoolean()
  paused?: boolean = false;

  @IsOptional()
  @IsBoolean()
  skipImmediately?: boolean = false;
}

export class CreateScheduleDto implements CreateFormBody<V1ScheduleSpec> {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  labels: Record<string, string>;

  @IsObject()
  @Type(() => CreateScheduleSpecDto)
  @ValidateNested()
  spec: V1ScheduleSpec;
}

export class EditScheduleDto implements EditFormBody<V1ScheduleSpec> {
  @IsObject()
  @Type(() => CreateScheduleSpecDto)
  @ValidateNested()
  spec: V1ScheduleSpec;
}
