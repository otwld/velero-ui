import {
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
export const operationPlurals = [
  'podvolumebackups',
  'podvolumerestores',
  'datauploads',
  'datadownloads',
] as const;
export class VolumeOperationsTargetDto {
  @IsIn(operationPlurals) plural: string;
  @IsString()
  @MaxLength(253)
  @Matches(/^[a-z0-9](?:[-a-z0-9.]*[a-z0-9])?$/)
  parent: string;
}
export class VolumeOperationsQueryDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(128) uid?: string;
}
export class VolumeOperationsUnwatchDto {
  @IsString() @MinLength(1) @MaxLength(128) requestId: string;
}
export class VolumeOperationsWatchDto extends VolumeOperationsTargetDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(128) uid?: string;
  @IsOptional() @IsString() @MaxLength(128) version?: string;
  @IsString() @MinLength(1) @MaxLength(128) requestId: string;
}
