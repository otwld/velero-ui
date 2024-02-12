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
        search: null,
      },
    } as ListStore),
  actions: {
    reset(): void {
      this.total = 0;
      this.offset = 0;
      this.limit = 20;
    },
    setTotal(total: number): void {
      this.total = total;
    },
    next(): void {
      if (this.offset + this.limit < this.total) {
        this.offset += 20;
      }
    },
    previous(): void {
      this.offset -= 20;

      if (this.offset < 0) {
        this.offset = 0;
      }
    },
    applyNameFilter(name: string): void {
      this.filters.startWith = name;
    },
  },
});
