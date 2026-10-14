import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { AxiosError } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Resources } from '@velero-ui/velero';
import { Filter } from '@velero-ui/shared-types';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { can } from '@velero-ui-app/utils/policy.utils';
import { usePodVolumeList } from './usePodVolumeList';
import {
  upload,
  download,
  filesystem,
} from '../utils/pod-volume-list.fixtures';

vi.mock('@velero-ui-app/utils/policy.utils', () => ({
  can: vi.fn(() => true),
}));

function panel(
  backup: boolean,
  get: ReturnType<typeof vi.fn>,
  client?: QueryClient
) {
  const queryClient =
    client ||
    new QueryClient({ defaultOptions: { queries: { gcTime: Infinity } } });
  let result: ReturnType<typeof usePodVolumeList>;
  const wrapper = mount(
    defineComponent({
      setup() {
        result = usePodVolumeList(backup);
        return () => null;
      },
    }),
    {
      global: {
        plugins: [createPinia(), [VueQueryPlugin, { queryClient }]],
        provide: { axios: { get } },
      },
    }
  );
  return { wrapper, queryClient, result: () => result };
}
const get = () =>
  vi
    .fn()
    .mockImplementation((route: string) =>
      Promise.resolve({
        data: {
          items:
            route === Resources.DATA_UPLOAD.route
              ? [upload]
              : route === Resources.DATA_DOWNLOAD.route
                ? [download]
                : route === Resources.POD_VOLUME_BACKUP.route
                  ? [filesystem]
                  : route === Resources.RESTORE.route
                    ? [
                        {
                          metadata: { name: 'restore', uid: 'restore-uid' },
                          spec: { backupName: 'daily' },
                        },
                      ]
                    : [],
        },
      })
    );

beforeEach(() => {
  setActivePinia(createPinia());
  vi.mocked(can).mockImplementation(() => true);
});

describe('pod volume menu queries', () => {
  it('loads both sources before applying shared filters and pagination', async () => {
    const requests = get();
    const instance = panel(true, requests);
    await flushPromises();
    expect(requests.mock.calls.map(([route]) => route).sort()).toEqual([
      '/data-uploads',
      '/pod-volume-backups',
    ]);
    expect(instance.result().data.value).toHaveLength(2);
    const store = useListStore();
    expect(store.total).toBe(2);
    store.setFilter(Filter.Status, 'InProgress');
    await flushPromises();
    expect(instance.result().data.value[0].resource.plural).toBe('datauploads');
    expect(store.total).toBe(1);
    instance.wrapper.unmount();
    instance.queryClient.clear();
  });
  it('loads downloads and resolves the parent restore backup', async () => {
    const instance = panel(false, get());
    await flushPromises();
    expect(instance.result().data.value[0]).toMatchObject({
      parentName: 'restore',
      backupName: 'daily',
      namespace: 'restored',
    });
    instance.wrapper.unmount();
    instance.queryClient.clear();
  });
  it('does not request or expose cached filesystem volumes without permission', async () => {
    vi.mocked(can).mockImplementation(
      (_, subject) => subject === 'datauploads'
    );
    const client = new QueryClient({
      defaultOptions: { queries: { gcTime: Infinity } },
    });
    client.setQueryData(['pod-volume-menu', 'podvolumebackups'], [filesystem]);
    const requests = get();
    const instance = panel(true, requests, client);
    await flushPromises();
    expect(requests.mock.calls.map(([route]) => route)).toEqual([
      '/data-uploads',
    ]);
    expect(instance.result().data.value).toHaveLength(1);
    expect(instance.result().data.value[0].dataMover).toBe(true);
    instance.wrapper.unmount();
    client.clear();
  });
  it('keeps filesystem volumes when data mover CRDs are absent', async () => {
    const error = new AxiosError('missing');
    error.response = { status: 404 } as typeof error.response;
    const requests = vi
      .fn()
      .mockImplementation((route) =>
        route === Resources.DATA_UPLOAD.route
          ? Promise.reject(error)
          : Promise.resolve({ data: { items: [filesystem] } })
      );
    const instance = panel(true, requests);
    await flushPromises();
    expect(instance.result().error.value).toBeNull();
    expect(instance.result().data.value).toHaveLength(1);
    instance.wrapper.unmount();
    instance.queryClient.clear();
  });
});
