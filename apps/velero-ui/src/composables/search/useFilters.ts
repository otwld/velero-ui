import { useListStore } from '@velero-ui-app/stores/list.store';
import { type Router, useRoute, useRouter } from 'vue-router';
import { Filter, type SearchFilters } from '@velero-ui/shared-types';

export const useFilters = () => {
  const listStore = useListStore();
  const route = useRoute();
  const router: Router = useRouter();

  const set = (key: Filter, value: string, hidden = false) => {
    console.log('ici')
    listStore.setFilter(key, value);

    if (!hidden) {
      const query = {
        ...route.query,
        [key]: value ? value : undefined,
      };

      router.push({query});
    }
  };

  const reset = () => {
    listStore.resetFilters();

    const query = {
      ...route.query,
    };

    for (const key in route.query) {
      query[key] = undefined;
    }

    router.push({ query });
  };

  return { set, reset };
};
