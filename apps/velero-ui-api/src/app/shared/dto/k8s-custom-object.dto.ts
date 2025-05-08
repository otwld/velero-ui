import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PLURALS } from '@velero-ui/velero';

export class K8sCustomObjectParams {
  @IsOptional()
  @IsIn(PLURALS)
  plural: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class K8SCustomObjectQueries {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : 0))
  offset: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : 20))
  limit: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortColumnName?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  sortColumnAscending?: boolean;
}
