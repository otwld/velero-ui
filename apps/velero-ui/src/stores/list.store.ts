import { defineStore } from 'pinia';
import type { Resource } from '@velero-ui/velero';
import {
  Filter,
  type FilterSelect,
  type ListHeader,
  type ListSort,
  type SearchFilters,
  type SearchPagination,
  type SearchSort,
  SortBy,
  SortDirection,
} from '@velero-ui/shared-types';

export interface ListStore extends SearchPagination {
  total: number;
  filters: SearchFilters<string>;
  availableFilters: SearchFilters<FilterSelect[]>;
  sort: SearchSort;
  headers: ListHeader[];
  objectType: Resource;
  checkedItems: Set<string>
}

export const useListStore = defineStore('list', {
  state: () =>
    ({
      total: 0,
      offset: 0,
      limit: parseInt(localStorage.getItem('list.limit')) || 20,
      filters: {},
      availableFilters: {},
      sort: {
        sortBy: SortBy.Name,
        sortDirection: SortDirection.Ascending,
      },
      headers: [],
      objectType: null,
      checkedItems: new Set<string>(),
    }) as ListStore,
  actions: {
    reset(): void {
      this.total = 0;
      this.offset = 0;

      this.resetSearch();
      this.resetSort();
      this.resetCheckedItems();
    },
    resetSearch(): void {
      this.filters = {};
      this.availableFilters = {};
      this.offset = 0;
    },
    resetSort(): void {
      this.sort.sortBy = SortBy.Name;
      this.sort.sortDirection = SortDirection.Ascending;
    },
    resetFilters(): void {
      this.filters = {};
    },
    resetCheckedItems(): void {
      this.checkedItems.clear();
    },
    setTotal(total: number): void {
      this.total = total;
    },
    setLimit(limit: number): void {
      this.limit = limit;
      localStorage.setItem('list.limit', limit.toString());
    },
    setAvailableFilters(filters: SearchFilters<FilterSelect[]>): void {
      this.availableFilters = filters;
    },
    setFilter(key: Filter, value: string): void {
      if (value) {
        this.filters[key] = value;
      } else {
        delete this.filters[key];
      }
      this.offset = 0;
    },
    setFilters(filters: SearchFilters): void {
      this.filters = filters;
    },
    setObjectType(type: Resource): void {
      //this.reset();
      this.objectType = type;
    },
    next(): void {
      if (this.offset + this.limit < this.total) {
        this.offset += this.limit;
      }
    },
    previous(): void {
      this.offset -= this.limit;

      if (this.offset < 0) {
        this.offset = 0;
      }
    },
    setHeaders(headers: ListHeader[]): void {
      this.headers = headers;
    },
    applyHeaderSort(sort: ListSort): void {
      const header = this.headers.find((h) => h.sort?.type === sort.type);

      const newSort = {
        type: header.sort.type,
        selected: true,
        direction:
          header.sort?.direction === SortDirection.Ascending
            ? SortDirection.Descending
            : SortDirection.Ascending,
      };

      this.headers.forEach((h) => {
        if (h.sort) {
          if (h.sort.type === sort.type) {
            h.sort = newSort;
          } else {
            h.sort.selected = false;
            h.sort.direction = undefined;
          }
        }
      });

      this.sort.sortBy = newSort.type;
      this.sort.sortDirection = newSort.direction;
    },
  },
});
