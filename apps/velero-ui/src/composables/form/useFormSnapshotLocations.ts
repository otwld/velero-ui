import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import type { FormList } from '@velero-ui/shared-types';
import { useQuery } from '@tanstack/vue-query';

export const useFormSnapshotLocations = () => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  return useQuery<FormList<string>>({
    queryKey: ['form', 'snapshot-locations'],
    queryFn: async () =>
      (
        await axiosInstance.get<FormList<string>>(
          ApiRoutes.FORM_SNAPSHOT_LOCATIONS,
        )
      ).data,
    refetchOnWindowFocus: false,
    initialData: {
      items: [],
      total: 0,
    },
  });
};
