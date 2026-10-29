import { Type } from 'class-transformer';
import {
  IsObject,
  IsBoolean,
  IsDefined,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { SearchDto } from '../../shared/dto/search.dto';
export class PodVolumeUnwatchDto {
  @IsBoolean() backup: boolean;
}
export class PodVolumeWatchDto extends PodVolumeUnwatchDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SearchDto)
  search: SearchDto;
  @IsString() @MinLength(1) @MaxLength(128) requestId: string;
}
