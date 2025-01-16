import { QueryClient, useMutation, useQueryClient } from '@tanstack/vue-query';
import type { AxiosInstance } from 'axios';
import { inject } from 'vue';
import { type Resource } from '@velero-ui/velero';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import type { KubernetesObject } from '@kubernetes/client-node';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { storeToRefs } from 'pinia';
import {useI18n} from "vue-i18n";

export const useDeleteKubernetesObject = <T extends KubernetesObject>(
  resource: Resource,
) => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const queryClient: QueryClient = useQueryClient();

  const { t } = useI18n();
  const listStore = useListStore();
  const { offset, limit, filters, sort } = storeToRefs(listStore);

  return useMutation({
    mutationFn: async (name: string) =>
      await axiosInstance.delete(`${resource.route}/${name}`),
    onSuccess: async (response, name: string) => {
      await queryClient.cancelQueries({
        queryKey: [
          resource.plural,
          {
            limit,
            offset,
            filters,
            sort,
          },
        ],
      });
      await queryClient.cancelQueries({ queryKey: [resource.plural, name] });

      const previousObjects: T[] = queryClient.getQueryData([
        resource.plural,
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
            resource.plural,
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
        queryKey: [resource.plural, name],
        exact: true,
      });

      toastsStore.push(
        t('global.message.success.deleteRequestCreated'),
        ToastType.SUCCESS,
      );
    },
    onError: (error: Error): void => {
      toastsStore.push(t('global.message.error.unexpected'), ToastType.ERROR);
      console.error(error);
    },
  });
};
