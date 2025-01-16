import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { type CreateFormBody, EditFormBody } from '@velero-ui/shared-types';
import {
  V1SpecCredential,
  V1VolumeSnapshotLocationSpec,
} from '@velero-ui/velero';
import { Type } from 'class-transformer';
import { V1SpecCredentialDto } from '@velero-ui-api/shared/dto/shared.dto';

export class CreateVolumeSnapshotLocationSpecDto
  implements V1VolumeSnapshotLocationSpec
{
  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => V1SpecCredentialDto)
  credential?: V1SpecCredential;

  @IsOptional()
  @IsObject()
  config?: object;
}

export class CreateVolumeSnapshotLocationDto
  implements CreateFormBody<V1VolumeSnapshotLocationSpec>
{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  labels: Record<string, string>;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateVolumeSnapshotLocationSpecDto)
  spec: V1VolumeSnapshotLocationSpec;
}

export class EditVolumeSnapshotLocationDto
  implements EditFormBody<V1VolumeSnapshotLocationSpec>
{
  @IsObject()
  @ValidateNested()
  @Type(() => CreateVolumeSnapshotLocationSpecDto)
  spec: V1VolumeSnapshotLocationSpec;
}
