import {
  IsArray, IsBoolean,
  IsEnum,
  IsNotEmpty, IsNumber,
  IsObject, IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

enum CreateBackupTypeEnum {
  FROM_SCHEDULE = 'schedule',
  FROM_SCRATCH = 'custom',
}

export class CreateBackupDataFromScheduleDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateBackupDataFromScratchDto {
  @IsOptional()
  @IsNumber()
  sciSnapshotTimeout: number;

  @IsOptional()
  @IsString()
  dataMover: string;

  @IsOptional()
  @IsBoolean()
  defaultVolumesToFsBackup: boolean = true;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeClusterScopedResources: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeNamespaceScopedResources: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeNamespaces: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeResources: string[];

  @IsOptional()
  @IsBoolean()
  includeClusterResources: boolean = true;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includeClusterScopedResources: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includeNamespaceScopedResources: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includeNamespaces: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includeResources: string[];

  @IsOptional()
  @IsNumber()
  itemOperationTimeout: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labelColumns: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels: Record<string, string>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  orSelector: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  orderedResources: string[];

  @IsOptional()
  @IsNumber()
  parallelFilesUpload: number;

  @IsOptional()
  @IsString()
  resourcePoliciesConfigmap: string;

  @IsOptional()
  @IsString()
  selector: string;

  @IsOptional()
  @IsBoolean()
  snapshotMoveData: boolean = true;

  @IsOptional()
  @IsBoolean()
  snapshotVolumes: boolean = true;

  @IsOptional()
  @IsString()
  storageLocation: string;

  @IsOptional()
  @IsNumber()
  ttl: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  volumeSnapshotLocations: string[];
}

export class CreateBackupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(CreateBackupTypeEnum)
  type: CreateBackupTypeEnum;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateBackupDto, {
    discriminator: {
      property: 'type',
      subTypes: [
        {
          value: CreateBackupDataFromScheduleDto,
          name: CreateBackupTypeEnum.FROM_SCHEDULE,
        },
        {
          value: CreateBackupDataFromScratchDto,
          name: CreateBackupTypeEnum.FROM_SCRATCH,
        },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  data: CreateBackupDataFromScheduleDto | CreateBackupDataFromScratchDto;
}
