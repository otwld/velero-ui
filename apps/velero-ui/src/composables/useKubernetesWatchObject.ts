import { QueryClient, useQuery, useQueryClient } from '@tanstack/vue-query';
import { inject } from 'vue';
import { debounce } from 'lodash';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { storeToRefs } from 'pinia';
import type { KubernetesObject } from '@kubernetes/client-node';
import type { Resource } from '@velero-ui/velero';
import type { AxiosInstance } from 'axios';
import type { SocketIO } from '@velero-ui-app/plugins/socket.plugin';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';

export const useKubernetesWatchObject = <T extends KubernetesObject>(
  resource: Resource,
  name: string,
) => {
  const toastsStore = useToastsStore();
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;
  const socket = inject('socketIo') as SocketIO;
  const queryClient: QueryClient = useQueryClient();

  const listStore = useListStore();
  const {offset, limit, filters, sort} = storeToRefs(listStore);

  const on = () => {
    socket.io.emit(`watch:on`, {name, plural: resource.plural});

    socket.io.on(
      `watch:${ resource.plural }:${ name }:ADDED`,
      (object: T): void => {
        queryClient.setQueryData([resource.plural, name], object);
      },
    );

    socket.io.on(
      `watch:${ resource.plural }:${ name }:MODIFIED`,
      debounce((object: T) => {
        queryClient.setQueryData([resource.plural, name], object);
      }, 300),
    );

    socket.io.on(`watch:${ resource.plural }:${ name }:DELETED`,
      debounce((object: T) => {
        queryClient.setQueryData([resource.plural, name], undefined);
        queryClient.setQueryData(
          [resource.plural, {limit, offset, filters, sort}],
          (oldData?: T[]) => {
            return oldData?.filter(
              (obj: T) => obj.metadata.name !== object.metadata.name,
            );
          },
        );

        toastsStore.push(
          `Resource ${ name } has been deleted by velero server.`,
          ToastType.WARNING,
        );
      }, 300));

  };

  const off = () => {
    socket.io.off(`watch:${ resource.plural }:${ name }:ADDED`);
    socket.io.off(`watch:${ resource.plural }:${ name }:MODIFIED`);
    socket.io.off(`watch:${ resource.plural }:${ name }:DELETED`);
    socket.io.emit(`watch:off`, {
      name,
    });
  };

  const {data, isLoading, error} = useQuery<T>({
    queryKey: [resource.plural, name],
    queryFn: async () =>
      (await axiosInstance.get<T>(`/resources/${ resource.plural }/${ name }`))
        .data,
    initialData: () => {
      return queryClient
        .getQueryData<T[]>([
          resource.plural,
          {
            limit,
            offset,
            filters,
            sort,
          },
        ])
        ?.find((obj: T): boolean => obj.metadata.name === name);
    },
  });

  return {on, off, data, isLoading, error};
};
