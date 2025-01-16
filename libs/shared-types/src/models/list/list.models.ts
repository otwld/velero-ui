export interface ListOptions {
  limit: number;
  offset: number;
  filters?: ListSearchFilters;
  sort?: ListSort;
}

export interface ListSort {
  column: ListSortColumn;
}

export interface ListSearchFilters {
  startWith: string;
}

export interface ListSortColumn {
  name: string;
  ascending: boolean;
}

export interface ListHeader {
  name: string;
  sort: {
    enabled: boolean;
    selected?: boolean;
    ascending?: true;
  };
}
