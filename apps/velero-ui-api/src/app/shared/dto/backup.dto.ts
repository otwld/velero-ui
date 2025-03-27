import {
  ArrayMinSize,
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
import { V1BackupSpec, V1UploaderConfigForBackup } from '@velero-ui/velero';
import {
  CreateBackupScheduleBody,
  CreateBackupTypeEnum,
  type CreateFormBody,
} from '@velero-ui/shared-types';

export class CreateBackupScheduleDto implements CreateBackupScheduleBody {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateBackupUploaderConfigDto
  implements V1UploaderConfigForBackup
{
  @IsOptional()
  @IsNumber()
  parallelFilesUpload?: number;
}

export class CreateBackupScratchDto implements V1BackupSpec {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @IsString({ each: true })
  includedNamespaces?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @IsString({ each: true })
  excludedNamespaces?: string[];

  @IsArray()
  @ArrayMinSize(0)
  @IsString({ each: true })
  includedResources: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @IsString({ each: true })
  excludedResources?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @IsString({ each: true })
  includedClusterScopedResources?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @IsString({ each: true })
  excludedClusterScopedResources?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includedNamespaceScopedResources?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @IsString({ each: true })
  excludedNamespaceScopedResources?: string[];

  @IsOptional()
  @IsObject()
  labelSelector?: object;

  @IsOptional()
  @IsObject()
  orLabelSelectors?: Record<string, string>;

  @IsOptional()
  @IsBoolean()
  snapshotVolumes?: boolean = true;

  @IsNotEmpty()
  @IsString()
  ttl: string;

  @IsOptional()
  @IsBoolean()
  includeClusterResources?: boolean;

  @IsNotEmpty()
  @IsString()
  storageLocation: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  volumeSnapshotLocations: string[];

  @IsOptional()
  @IsBoolean()
  defaultVolumesToFsBackup?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  orderedResources?: string[];

  @IsOptional()
  @IsString()
  sciSnapshotTimeout?: string;

  @IsOptional()
  @IsString()
  itemOperationTimeout?: string;

  @IsOptional()
  @IsBoolean()
  snapshotMoveData?: boolean;

  @IsOptional()
  @IsString()
  dataMover?: string;

  @IsOptional()
  @IsObject()
  resourcePolicy?: object;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateBackupUploaderConfigDto)
  uploaderConfig?: V1UploaderConfigForBackup;
}

export class CreateBackupDto
  implements CreateFormBody<V1BackupSpec | CreateBackupScheduleBody>
{
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
      ? CreateBackupScheduleDto
      : CreateBackupScratchDto,
  )
  @ValidateNested()
  spec: CreateBackupScheduleDto | CreateBackupScratchDto;
}
