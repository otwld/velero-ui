import { defineStore } from 'pinia';
import type { Resource } from '@velero-ui/velero';
import type {
  ListHeader,
  ListSearchFilters,
  ListSort,
} from '@velero-ui/shared-types';

export interface ListStore {
  total: number;
  offset: number;
  limit: number;
  filters: ListSearchFilters;
  sort: ListSort;
  headers: ListHeader[];
  objectType: Resource;
}

export const useListStore = defineStore('list', {
  state: () =>
    ({
      total: 0,
      offset: 0,
      limit: parseInt(localStorage.getItem('list.limit')) || 20,
      filters: {
        startWith: '',
      },
      sort: {
        column: {
          name: 'Name',
          ascending: true,
        },
      },
      headers: [],
      objectType: null,
    }) as ListStore,
  actions: {
    reset(): void {
      this.total = 0;
      this.offset = 0;

      this.resetSearch();
      this.resetSort();
    },
    resetSearch(): void {
      this.filters.startWith = '';
    },
    resetSort(): void {
      this.sort.column.name = 'Name';
      this.sort.column.ascending = true;
    },
    resetChecked(): void {
      this.checked = {};
    },
    setTotal(total: number): void {
      this.total = total;
    },
    setOffset(offset: number): void {
      this.offset = offset;
    },
    setLimit(limit: number): void {
      this.limit = limit;
      localStorage.setItem('list.limit', limit.toString());
    },
    setObjectType(type: Resource): void {
      this.reset();
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
    applyNameFilter(name: string): void {
      this.filters.startWith = name;
    },
    setHeaders(headers: ListHeader[]): void {
      this.headers = headers;
    },
    applyHeaderSort(name: string): void {
      const index = this.headers.findIndex((h) => h.name === name);

      if (index !== -1 && this.headers[index].sort.selected) {
        this.headers[index].sort.ascending =
          !this.headers[index].sort.ascending;
        this.sort.column.ascending = this.headers[index].sort.ascending;
      } else if (index !== -1 && this.headers[index]?.sort.enabled) {
        this.headers.forEach((h) => {
          if (h.sort.selected) {
            h.sort.selected = false;
          }
        });

        this.headers[index].sort.selected = true;
        this.headers[index].sort.ascending = true;
        this.sort.column.name = this.headers[index].name;
        this.sort.column.ascending = true;
      }
    },
  },
});
