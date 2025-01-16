import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  type CreateFormBody, EditFormBody,
} from '@velero-ui/shared-types';
import {
  V1BackupStorageLocationAccessMode,
  V1BackupStorageLocationObjectStorageLocation,
  V1BackupStorageLocationSpec, V1SpecCredential,
} from '@velero-ui/velero';
import { Type } from 'class-transformer';
import {V1SpecCredentialDto} from "@velero-ui-api/shared/dto/shared.dto";

export class CreateStorageLocationObjectStorageDto
  implements V1BackupStorageLocationObjectStorageLocation
{
  @IsString()
  @IsNotEmpty()
  bucket: string;

  @IsOptional()
  @IsString()
  prefix?: string;

  @IsOptional()
  @IsString()
  caCert?: string;
}

export class CreateStorageLocationSpecDto
  implements V1BackupStorageLocationSpec
{
  @IsOptional()
  @IsEnum(V1BackupStorageLocationAccessMode)
  accessMode: V1BackupStorageLocationAccessMode =
    V1BackupStorageLocationAccessMode.ReadWrite;

  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsOptional()
  @IsString()
  backupSyncPeriod?: string = '1m';

  @IsOptional()
  @IsString()
  validationFrequency?: string = '1m';

  @IsOptional()
  @IsObject()
  labels?: Record<string, string>;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => V1SpecCredentialDto)
  credential?: V1SpecCredential;

  @IsOptional()
  @IsObject()
  config?: object;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateStorageLocationObjectStorageDto)
  objectStorage: V1BackupStorageLocationObjectStorageLocation;
}

export class CreateStorageLocationDto
  implements CreateFormBody<V1BackupStorageLocationSpec>
{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  labels: Record<string, string>;

  @IsObject()
  @Type(() => CreateStorageLocationSpecDto)
  @ValidateNested()
  spec: V1BackupStorageLocationSpec;
}

export class EditStorageLocationDto
  implements EditFormBody<V1BackupStorageLocationSpec>
{

  @IsObject()
  @Type(() => CreateStorageLocationSpecDto)
  @ValidateNested()
  spec: V1BackupStorageLocationSpec;
}
