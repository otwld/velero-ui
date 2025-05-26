import { Filter, SortBy, SortDirection } from '../../enums';

export interface SearchPagination {
  offset?: number;
  limit?: number;
}

export interface SearchSort {
  sortBy?: SortBy;
  sortDirection?: SortDirection;
}

export interface FilterSelect {
  value: string;
  disabled: boolean;
}

export interface FilterDate {
  from?: Date | string;
  to?: Date | string;
}

export interface SearchFilters<T = string | string[] | Set<string> | FilterSelect[]> {
  [Filter.Search]?: T;
  [Filter.StorageLocation]?: T;
  [Filter.Schedule]?: T;
  [Filter.Status]?: T;
  [Filter.Backup]?: T;
  [Filter.RepositoryType]?: T;
  [Filter.AccessMode]?: T;
  [Filter.Provider]?: T;
  [Filter.TargetKind]?: T;
  [Filter.Paused]?: T;
}

export interface Search extends SearchPagination, SearchSort, SearchFilters<string> {}

export type SortValueGetter<T> = (item: T) => string | Date | undefined;
