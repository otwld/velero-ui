import { QueryClient, useMutation, useQueryClient } from '@tanstack/vue-query';
import type { AxiosInstance } from 'axios';
import { inject } from 'vue';
import { type Resource, Resources } from '@velero-ui/velero';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import type { KubernetesObject } from '@kubernetes/client-node';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

export const useDeleteManyKubernetesObjects = <T extends KubernetesObject>(
  resource: Resource
) => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const queryClient: QueryClient = useQueryClient();

  const { t } = useI18n();
  const listStore = useListStore();
  const { offset, limit, filters, sort } = storeToRefs(listStore);

  return useMutation({
    mutationFn: async ({
      names,
      forced,
    }: {
      names: string[];
      forced?: boolean;
    }) =>
      await axiosInstance.delete(`${resource.route}`, {
        data: names,
        params: { forced },
      }),
    onSuccess: async (
      response,
      {
        names,
        forced,
      }: {
        names: string[];
        forced?: boolean;
      }
    ) => {
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
            objects.filter((object: T) => !names.includes(object.metadata.name))
        );
      }

      if (resource.kind === Resources.BACKUP.kind && !forced) {
        toastsStore.push(
          t('global.message.success.deleteRequestCreated', {
            resource: resource.name,
          }),
          ToastType.SUCCESS
        );
      } else {
        toastsStore.push(
          t('global.message.success.deleted', { resource: resource.name }),
          ToastType.SUCCESS
        );
      }
    },
    onError: (error: Error): void => {
      toastsStore.push(t('global.message.error.unexpected'), ToastType.ERROR);
      console.error(error);
    },
  });
};
