import { computed, inject, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { AxiosInstance } from 'axios';
import { isAxiosError } from 'axios';
import type { Resource } from '@velero-ui/velero';
import type { KubernetesListObjectWithFilters } from '@velero-ui/shared-types';
import {
  belongsToParent,
  type VolumeOperation,
} from '@velero-ui-app/utils/volume.utils';

/** Detail panels have their own queries so they do not change the list filters or socket watch. */
export function useVolumeOperations<T extends VolumeOperation>(
  resource: Resource,
  name: Ref<string>,
  backup: boolean,
  allowed: boolean,
  uid?: Ref<string | undefined>
) {
  const axios = inject('axios') as AxiosInstance;
  return useQuery({
    queryKey: computed(() => [
      'volume-operations',
      resource.plural,
      name.value,
      uid?.value,
    ]),
    enabled: allowed,
    queryFn: async (): Promise<T[]> => {
      try {
        const response = await axios.get<KubernetesListObjectWithFilters<T>>(
          resource.route
        );
        return response.data.items.filter((item) =>
          belongsToParent(item, name.value, backup, uid?.value)
        );
      } catch (error) {
        // Velero versions without data mover CRDs have no data mover volumes.
        if (
          isAxiosError(error) &&
          error.response?.status === 404 &&
          ['datauploads', 'datadownloads'].includes(resource.plural)
        )
          return [];
        throw error;
      }
    },
    initialData: () => [],
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
