import { IsEnum, IsNumber, IsOptional, IsString, Matches, } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  Filter,
  REGEX,
  Search,
  SearchFilters,
  SearchPagination,
  SearchSort,
  SortBy,
  SortDirection,
} from '@velero-ui/shared-types';
import { V1BackupRepositoryType, V1BackupStorageLocationAccessMode, } from '@velero-ui/velero';
import { IntersectionType } from "@nestjs/mapped-types";

export class SearchPaginationDto implements SearchPagination {
  @IsOptional()
  @IsNumber()
  @Transform(({value}) => (value !== undefined ? parseFloat(value) : 0))
  offset?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({value}) => (value !== undefined ? parseFloat(value) : 20))
  limit?: number;
}

export class SearchSortDto implements SearchSort {
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;

  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}

export class SearchFiltersDto implements SearchFilters<string> {
  @Transform(({value}) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  @Matches(REGEX.k8sResourceName, {
    message:
      'search must be 1 to 63 characters long, start and end with an alphanumeric character, and only contain letters, numbers, dashes, underscores, or dots',
  })
  [Filter.Search]?: string;

  @Transform(({value}) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  [Filter.StorageLocation]?: string;

  @Transform(({value}) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  [Filter.Schedule]?: string;

  @Transform(({value}) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  [Filter.Status]?: string;

  @Transform(({value}) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  [Filter.Backup]?: string;

  @Transform(({value}) => (value === '' ? undefined : value))
  @IsOptional()
  @IsEnum(V1BackupRepositoryType)
  [Filter.RepositoryType]?: V1BackupRepositoryType;

  @Transform(({value}) => (value === '' ? undefined : value))
  @IsOptional()
  @IsEnum(V1BackupStorageLocationAccessMode)
  [Filter.AccessMode]?: V1BackupStorageLocationAccessMode;

  @Transform(({value}) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  [Filter.Provider]?: string;

  @Transform(({value}) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  [Filter.TargetKind]?: string;

  @Transform(({value}) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  [Filter.Paused]?: string;
}

export class SearchDto extends IntersectionType(
  IntersectionType(SearchFiltersDto, SearchSortDto),
  SearchPaginationDto,
) implements Search {}
