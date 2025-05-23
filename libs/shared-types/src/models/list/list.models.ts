import { SortBy, SortDirection } from '../../enums';

export interface ListSort {
  selected?: boolean;
  direction?: SortDirection;
  type: SortBy;
}

export interface ListHeader {
  name: string;
  sort?: ListSort;
}
