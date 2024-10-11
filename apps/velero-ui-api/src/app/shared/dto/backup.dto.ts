import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { V1BackupSpec } from '@velero-ui/velero';
import {
  type CreateBackupFormBody,
  CreateBackupTypeEnum,
} from '@velero-ui/shared-types';

export class CreateBackupDataFromScheduleDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateBackupDataFromScratchDto implements V1BackupSpec {
  @IsOptional()
  @IsNumber()
  sciSnapshotTimeout?: number;

  @IsOptional()
  @IsString()
  dataMover?: string;

  @IsOptional()
  @IsBoolean()
  defaultVolumesToFsBackup? = true;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludedClusterScopedResources?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludedNamespaceScopedResources?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludedNamespaces?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludedResources?: string[];

  @IsOptional()
  @IsBoolean()
  includeClusterResources? = true;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includedClusterScopedResources?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includedNamespaceScopedResources?: string[];

  @IsArray()
  @IsString({ each: true })
  includedNamespaces: string[];

  @IsArray()
  @IsString({ each: true })
  includedResources: string[];

  @IsOptional()
  @IsNumber()
  itemOperationTimeout?: string;

  @IsOptional()
  @IsObject()
  labelSelector?: object;

  @IsOptional()
  @IsObject()
  orSelector?: Record<string, string>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  orderedResources?: string[];

  @IsOptional()
  @IsNumber()
  parallelFilesUpload?: number;

  @IsOptional()
  @IsString()
  resourcePoliciesConfigmap?: string;

  @IsOptional()
  @IsBoolean()
  snapshotMoveData? = true;

  @IsOptional()
  @IsBoolean()
  snapshotVolumes? = true;

  @IsString()
  storageLocation: string;

  @IsString()
  ttl: string;

  @IsArray()
  @IsString({ each: true })
  volumeSnapshotLocations: string[];
}

export class CreateBackupDto implements CreateBackupFormBody {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(CreateBackupTypeEnum)
  type: CreateBackupTypeEnum;

  @IsOptional()
  labels: Record<string, string>;

  @IsObject()
  @Type((opts) =>
    opts.object.type === CreateBackupTypeEnum.FROM_SCHEDULE
      ? CreateBackupDataFromScheduleDto
      : CreateBackupDataFromScratchDto,
  )
  data: CreateBackupDataFromScheduleDto | CreateBackupDataFromScratchDto;
}
