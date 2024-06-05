import { defineStore } from 'pinia';

export interface ListSearchFilters {
  startWith: string;
}

export interface ListStore {
  total: number;
  offset: number;
  limit: number;
  filters: ListSearchFilters;
}

export const useListStore = defineStore({
  id: 'list',
  state: () =>
    ({
      total: 0,
      offset: 0,
      limit: 20,
      filters: {
        startWith: '',
      },
    } as ListStore),
  actions: {
    reset(): void {
      this.total = 0;
      this.offset = 0;

      this.resetSearch();
    },
    resetSearch(): void {
      this.filters.startWith = '';
    },
    setTotal(total: number): void {
      this.total = total;
    },
    setLimit(limit: number): void {
      this.limit = limit;
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
  },
});
