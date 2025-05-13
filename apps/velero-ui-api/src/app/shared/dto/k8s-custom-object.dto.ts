import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString, Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PLURALS } from '@velero-ui/velero';
import { REGEX } from "@velero-ui/shared-types";

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

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  @Matches(REGEX.k8sResourceName, {

    message:
      'search must be 1 to 63 characters long, start and end with an alphanumeric character, and only contain letters, numbers, dashes, underscores, or dots',
  })
  search?: string;

  @IsOptional()
  @IsString()
  sortColumnName?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  sortColumnAscending?: boolean;
}
