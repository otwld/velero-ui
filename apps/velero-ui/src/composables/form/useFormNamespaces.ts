import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { ApiRoutes } from '../../utils/constants.utils';
import { useQuery } from '@tanstack/vue-query';
import type { FormList } from '@velero-ui/shared-types';

export const useFormNamespaces = () => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  return useQuery<FormList<string>>({
    queryKey: ['form', 'namespaces'],
    queryFn: async () =>
      (await axiosInstance.get<FormList<string>>(ApiRoutes.FORM_NAMESPACES))
        .data,
    refetchOnWindowFocus: false,
    initialData: {
      items: [],
      total: 0,
    },
  });
};
