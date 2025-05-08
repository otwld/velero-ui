import { inject } from 'vue';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { storeToRefs } from 'pinia';
import type {
  KubernetesListObject,
  KubernetesObject,
} from '@kubernetes/client-node';
import type { Resource } from '@velero-ui/velero';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/vue-query';
import { debounce } from 'lodash';
import type { AxiosInstance } from 'axios';
import type { SocketIO } from '@velero-ui-app/plugins/socket.plugin';

export const useKubernetesWatchListObject = <
  R extends KubernetesObject,
  T extends KubernetesListObject<R>,
>(
  resource: Resource,
) => {
  const axiosInstance: AxiosInstance = inject('axios') as AxiosInstance;

  const listStore = useListStore();
  const { offset, limit, filters, sort } = storeToRefs(listStore);

  const queryClient: QueryClient = useQueryClient();
  const socket = inject('socketIo') as SocketIO;

  const on = () => {
    socket.io.on(
      `watch:${resource.plural}:ADDED`,
      debounce((addedObject: R) => {
        queryClient.setQueryData<R[]>(
          [
            resource.plural,
            {
              limit,
              offset,
              filters,
              sort,
            },
          ],
          (oldData: R[] | undefined) => {
            if (!oldData) {
              return [addedObject];
            }

            const exists: R = oldData.find(
              (obj: R) => obj.metadata.name === addedObject.metadata.name,
            );

            if (exists) {
              return oldData;
            }

            const updatedData = [...oldData, addedObject];

            listStore.setTotal(updatedData.length);
            return updatedData;
          },
        );
      }, 300),
    );

    socket.io.on(
      `watch:${resource.plural}:MODIFIED`,
      debounce((modifiedObject: R) => {
        queryClient.setQueryData<R[]>(
          [
            resource.plural,
            {
              limit,
              offset,
              filters,
              sort,
            },
          ],
          (oldData: R[]) => {
            if (!oldData) {
              return [];
            }

            return oldData.map((obj: R) =>
              obj.metadata.name === modifiedObject.metadata.name
                ? modifiedObject
                : obj,
            );
          },
        );
      }, 300),
    );

    socket.io.on(`watch:${resource.plural}:DELETED`, (deletedObject: R) => {
      queryClient.setQueryData<R[]>(
        [
          resource.plural,
          {
            limit,
            offset,
            filters,
            sort,
          },
        ],
        (oldData: R[]) => {
          if (!oldData) {
            return [];
          }

          const data: R[] = oldData.filter(
            (obj: R) => obj.metadata.name !== deletedObject.metadata.name,
          );

          listStore.setTotal(data.length);
          return data;
        },
      );
    });
  };

  const off = () => {
    socket.io.off(`watch:${resource.plural}:ADDED`);
    socket.io.off(`watch:${resource.plural}:MODIFIED`);
    socket.io.off(`watch:${resource.plural}:DELETED`);
    socket.io.emit(`watch:off`);
  };

  const { data, isLoading, error, isFetching, refetch } = useQuery<R[]>({
    queryKey: [
      resource.plural,
      {
        limit,
        offset,
        filters,
        sort,
      },
    ],
    queryFn: async () => {
      const response = await axiosInstance.get<T>(
        `${resource.route}`,
        {
          params: {
            limit: limit.value,
            offset: offset.value,
            search: filters.value.startWith,
            sortColumnName: sort.value.column.name,
            sortColumnAscending: sort.value.column.ascending,
          },
        },
      );
      listStore.setTotal(response.data?.total);

      socket.io.emit(`watch:on`, {
        plural: resource.plural,
        version: response.data.metadata.resourceVersion,
      });

      return response.data.items;
    },

    initialData: [],
    refetchOnWindowFocus: false,
    placeholderData: [],
  });

  return { on, off, data, isLoading, isFetching, refetch, error };
};
