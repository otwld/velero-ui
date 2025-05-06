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
import { type CreateFormBody } from '@velero-ui/shared-types';
import {
  V1PolicyType,
  V1RestoreSpec,
  V1RestoreStatusSpec,
  V1UploaderConfigForRestore,
} from '@velero-ui/velero';
import { Type } from 'class-transformer';

export class CreateRestoreUploaderConfigDto
  implements V1UploaderConfigForRestore
{
  @IsOptional()
  @IsNumber()
  parallelFilesDownload?: number;

  @IsOptional()
  @IsBoolean()
  writeSparseFiles?: boolean;
}

export class CreateRestoreStatusDto implements V1RestoreStatusSpec {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @IsString({ each: true })
  excludedNamespaces?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @IsString({ each: true })
  includedResources?: string[];
}

export class CreateRestoreSpecDto implements V1RestoreSpec {
  @IsOptional()
  @IsString()
  backupName?: string;

  @IsOptional()
  @IsString()
  scheduleName?: string;

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

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @IsString({ each: true })
  includedResources?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @IsString({ each: true })
  excludedResources?: string[];

  @IsOptional()
  @IsObject()
  namespaceMapping?: object;

  @IsOptional()
  @IsObject()
  labelSelector?: object;

  @IsOptional()
  @IsObject()
  orLabelSelectors?: Record<string, string>;

  @IsOptional()
  @IsBoolean()
  restorePVs?: boolean = true;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateRestoreStatusDto)
  restoreStatus: V1RestoreStatusSpec;

  @IsOptional()
  @IsBoolean()
  preserveNodePorts?: boolean = true;

  @IsOptional()
  @IsBoolean()
  includeClusterResources?: boolean = true;

  @IsOptional()
  @IsEnum(V1PolicyType)
  existingResourcePolicy?: V1PolicyType;

  @IsOptional()
  @IsString()
  itemOperationTimeout?: string;

  @IsOptional()
  @IsObject()
  resourceModifier?: object;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateRestoreUploaderConfigDto)
  uploaderConfig?: V1UploaderConfigForRestore;
}

export class CreateRestoreDto implements CreateFormBody<V1RestoreSpec> {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  labels: Record<string, string>;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateRestoreSpecDto)
  spec: V1RestoreSpec;
}
