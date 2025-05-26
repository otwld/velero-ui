import {
  Filter,
  FilterSelect,
  KubernetesListObjectWithFilters,
  Search,
  SearchFilters,
  SortBy,
  SortDirection,
  SortValueGetter,
} from '@velero-ui/shared-types';
import {
  KubernetesListObject,
  KubernetesObject,
} from '@kubernetes/client-node';

const filterValueGetters: Record<
  Exclude<Filter, Filter.Search>,
  (
    item: KubernetesObject & {
      spec?: any;
      status?: any;
    }
  ) => string | undefined
> = {
  [Filter.AccessMode]: (item) => item.spec?.accessMode,
  [Filter.Provider]: (item) => item.spec?.provider,
  [Filter.RepositoryType]: (item) => item.spec?.repositoryType,
  [Filter.Schedule]: (item) =>
    item.metadata?.labels?.['velero.io/schedule-name'] ||
    item.spec?.scheduleName,
  [Filter.StorageLocation]: (item) =>
    item.spec?.backupStorageLocation || item.spec?.template?.storageLocation,
  [Filter.Backup]: (item) => item.spec?.backupName || item.spec?.tags?.backup,
  [Filter.Status]: (item) => item.status?.phase,
  [Filter.Paused]: (item) => item.spec?.paused?.toString(),
  [Filter.TargetKind]: (item) => item.spec?.target?.kind,
};

const sortGetters: Record<
  SortBy,
  SortValueGetter<
    KubernetesObject & {
      spec?: any;
      status?: any;
    }
  >
> = {
  [SortBy.Name]: (item) => item.metadata?.name || 'z',
  [SortBy.Schedule]: (item) =>
    item.metadata?.labels?.['velero.io/schedule-name'] ||
    item.spec?.scheduleName,
  [SortBy.StorageLocation]: (item) =>
    item.spec?.template?.storageLocation ||
    item.spec?.backupStorageLocation ||
    '',
  [SortBy.Provider]: (item) => item.spec?.provider,
  [SortBy.RepositoryType]: (item) => item.spec?.repositoryType,
  [SortBy.Expiration]: (item) => new Date(item.status?.expiration),
  [SortBy.LastMaintenanceTime]: (item) =>
    new Date(item.status?.lastMaintenanceTime),
  [SortBy.StartTimestamp]: (item) => new Date(item.status?.startTimestamp),
  [SortBy.CompletionTimestamp]: (item) =>
    new Date(item.status?.completionTimestamp),
  [SortBy.ProcessedTimestamp]: (item) =>
    new Date(item.status?.processedTimestamp),
  [SortBy.LastBackup]: (item) => new Date(item.status?.lastBackup),
  [SortBy.LastSync]: (item) => new Date(item.status?.lastSyncedTime),
};

const initAvailableFilters = (): SearchFilters<FilterSelect[]> => {
  return Object.fromEntries(
    Object.values(Filter).map((key: Filter) => [key, []])
  ) as SearchFilters<FilterSelect[]>;
};

const hasFilterValue = (
  filters: SearchFilters<FilterSelect[]>,
  filterType: Filter,
  value: string
): boolean => {
  if (!value) {
    return true;
  }

  return filters[filterType]?.some(
    (filter: FilterSelect) => filter.value === value
  );
};

function getValidValuesForFilter<
  T extends KubernetesObject & { spec?: any; status?: any },
>(items: T[], activeFilters: Search, targetFilter: Filter): string[] {
  return items
    .filter((item: T) => {
      return Object.entries(activeFilters).every(([key, value]) => {
        if (key === targetFilter || !value) {
          return true;
        }

        const getter = filterValueGetters[key as Filter];
        if (!getter) {
          return true;
        }

        const val = getter(item);
        if (key === Filter.Status) {
          return value.split(',').includes(val);
        }

        return val === value;
      });
    })
    .map((item: T) => filterValueGetters[targetFilter]?.(item))
    .filter(
      (v: string, i: number, self: string[]) => v && self.indexOf(v) === i
    );
}

const getFiltersValues = <
  T extends KubernetesObject & { spec?: any; status?: any },
>(
  filters: SearchFilters<FilterSelect[]>,
  item: T
) => {
  Object.entries(filterValueGetters).forEach(([filterKey, getter]) => {
    const value = getter(item);

    if (value && !hasFilterValue(filters, filterKey as Filter, value)) {
      filters[filterKey as Filter].push({ value, disabled: false });
    }
  });
};

export const filters = <
  T extends KubernetesObject & { spec?: any; status?: any },
>(
  response: KubernetesListObject<T>,
  search?: Search
): KubernetesListObjectWithFilters<T> => {
  const availableFilters: SearchFilters<FilterSelect[]> =
    initAvailableFilters();

  const originalItems: T[] = [...response.items];

  const filterTypes = Object.values(Filter).filter(
    (f): f is Exclude<Filter, Filter.Search> => f !== Filter.Search
  );

  response.items = response.items.filter((item: T) => {
    getFiltersValues(availableFilters, item);

    if (
      search?.[Filter.Search] &&
      !item.metadata.name
        .toLowerCase()
        .includes(search?.[Filter.Search].toLowerCase())
    ) {
      return false;
    }

    return !filterTypes.some(
      (filterType: Filter) =>
        search?.[filterType] &&
        filterValueGetters[filterType]?.(item) !== search?.[filterType]
    );
  });

  filterTypes.forEach((filterType: Filter) => {
    const validValues = getValidValuesForFilter(
      originalItems,
      search || {},
      filterType
    );

    availableFilters[filterType].forEach((option) => {
      option.disabled = !validValues.includes(option.value);
    });
  });

  return {
    ...response,
    total: response.items.length,
    filters: {
      [Filter.Status]: availableFilters[Filter.Status],
      [Filter.AccessMode]: availableFilters[Filter.AccessMode],
      [Filter.Provider]: availableFilters[Filter.Provider],
      [Filter.RepositoryType]: availableFilters[Filter.RepositoryType],
      [Filter.Schedule]: availableFilters[Filter.Schedule],
      [Filter.StorageLocation]: availableFilters[Filter.StorageLocation],
      [Filter.Backup]: availableFilters[Filter.Backup],
      [Filter.TargetKind]: availableFilters[Filter.TargetKind],
      [Filter.Paused]: availableFilters[Filter.Paused],
    },
  };
};

export const sort = <T extends KubernetesObject & { spec?: any; status?: any }>(
  response: KubernetesListObjectWithFilters<T>,
  by: SortBy,
  direction: SortDirection
) => {
  const getter = sortGetters[by];

  if (!getter) {
    return response;
  }

  const isDateSort: boolean =
    getter(new Proxy({}, { get: () => undefined })) instanceof Date;

  response.items = [...response.items].sort((a, b) => {
    const aValue: string | Date = getter(a);
    const bValue: string | Date = getter(b);

    if (isDateSort) {
      return sortDate(
        aValue instanceof Date ? aValue : new Date(aValue || 0),
        bValue instanceof Date ? bValue : new Date(bValue || 0),
        direction === SortDirection.Ascending
      );
    } else {
      return sortAlphabetically(
        String(aValue || ''),
        String(bValue || ''),
        direction === SortDirection.Ascending
      );
    }
  });

  return response;
};

export const slice = <T extends KubernetesObject>(
  response: KubernetesListObjectWithFilters<T>,
  offset = 0,
  limit?: number
): KubernetesListObjectWithFilters<T> => {
  return {
    ...response,

    items: limit
      ? response.items.slice(offset, offset + limit)
      : response.items,
  };
};

export const sortAlphabetically = (
  a: string,
  b: string,
  ascending = true
): number => (ascending ? a?.localeCompare(b) : -1 * a?.localeCompare(b));

export const sortDate = (a: Date, b: Date, ascending = true): number =>
  ascending ? a.getTime() - b.getTime() : b.getTime() - a.getTime();
