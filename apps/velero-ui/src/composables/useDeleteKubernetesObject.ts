import { QueryClient, useMutation, useQueryClient } from '@tanstack/vue-query';
import type { AxiosInstance } from 'axios';
import { inject } from 'vue';
import { type Resource } from '@velero-ui/velero';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import type { KubernetesObject } from '@kubernetes/client-node';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { storeToRefs } from 'pinia';

export const useDeleteKubernetesObject = <T extends KubernetesObject>(
  resource: Resource,
) => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const queryClient: QueryClient = useQueryClient();

  const listStore = useListStore();
  const { offset, limit, filters, sort } = storeToRefs(listStore);

  return useMutation({
    mutationFn: (name: string) =>
      axiosInstance.delete(`${resource.route}/${name}`),
    onSuccess: async (response, name: string) => {
      await queryClient.cancelQueries({
        queryKey: [
          resource.plurial,
          {
            limit,
            offset,
            filters,
            sort,
          },
        ],
      });
      await queryClient.cancelQueries({ queryKey: [resource.plurial, name] });

      const previousObjects: T[] = queryClient.getQueryData([
        resource.plurial,
        {
          limit,
          offset,
          filters,
          sort,
        },
      ]) as T[];

      if (previousObjects) {
        queryClient.setQueryData(
          [
            resource.plurial,
            {
              limit,
              offset,
              filters,
              sort,
            },
          ],
          (objects: T[]) =>
            objects.filter((object: T) => object.metadata.name !== name),
        );
      }

      queryClient.resetQueries({
        queryKey: [resource.plurial, name],
        exact: true,
      });

      toastsStore.push(
        'Delete request created, request will now be processed by velero server.',
        ToastType.SUCCESS,
      );
    },
    onError: (error: Error): void => {
      toastsStore.push('Unable to delete, please try again.', ToastType.ERROR);
      console.error(error);
    },
  });
};
