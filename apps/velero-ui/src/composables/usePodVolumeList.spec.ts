import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, onBeforeMount, onBeforeUnmount } from 'vue';
import { createPinia } from 'pinia';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Filter, type PodVolumeListPage } from '@velero-ui/shared-types';
import { Resources } from '@velero-ui/velero';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { can } from '@velero-ui-app/utils/policy.utils';
import { podVolumeListItem } from '../utils/pod-volume-list.utils';
import { upload } from '../utils/pod-volume-list.fixtures';
import { usePodVolumeList } from './usePodVolumeList';

vi.mock('@velero-ui-app/utils/policy.utils', () => ({
  can: vi.fn(() => true),
}));
const item = podVolumeListItem(upload, Resources.DATA_UPLOAD);
const page = (offset = 0, limit = 20): PodVolumeListPage => ({
  items: Array.from({ length: limit }, (_, i) => ({
    ...item,
    metadata: { ...item.metadata, name: `upload-${offset + i}` },
  })),
  total: 10000,
  filters: {},
  offset,
  limit,
  issues: [],
});
function panel(
  get = vi.fn((_route, options) =>
    Promise.resolve({ data: page(options.params.offset, options.params.limit) })
  )
) {
  const client = new QueryClient({
    defaultOptions: { queries: { gcTime: Infinity } },
  });
  const handlers = new Map<string, Set<(value?: unknown) => void>>();
  const io = {
    emit: vi.fn(),
    on: vi.fn((event, callback) => {
      if (!handlers.has(event)) handlers.set(event, new Set());
      handlers.get(event).add(callback);
    }),
    off: vi.fn((event, callback) => handlers.get(event)?.delete(callback)),
  };
  let result: ReturnType<typeof usePodVolumeList>;
  const wrapper = mount(
    defineComponent({
      setup() {
        result = usePodVolumeList(true);
        onBeforeMount(result.on);
        onBeforeUnmount(result.off);
        return () => null;
      },
    }),
    {
      global: {
        plugins: [createPinia(), [VueQueryPlugin, { queryClient: client }]],
        provide: { axios: { get }, socketIo: { io } },
      },
    }
  );
  return {
    get,
    io,
    client,
    result: () => result,
    store: useListStore(),
    deliver: (event: string, value?: unknown) =>
      handlers.get(event)?.forEach((callback) => callback(value)),
    subscription: () =>
      io.emit.mock.calls
        .filter(([event]) => event === 'pod-volumes:watch')
        .at(-1)?.[1],
    close: () => {
      wrapper.unmount();
      client.clear();
    },
  };
}
beforeEach(() => {
  localStorage.clear();
  vi.mocked(can).mockReturnValue(true);
});
describe('server paginated pod volume lists', () => {
  it('loads only twenty rows for ten thousand entries and requests the next page from the server', async () => {
    const instance = panel();
    await flushPromises();
    expect(instance.get).toHaveBeenCalledTimes(1);
    expect(instance.get).toHaveBeenCalledWith(
      '/pod-volumes/backups',
      expect.objectContaining({
        params: expect.objectContaining({ limit: 20, offset: 0 }),
      })
    );
    expect(instance.result().data.value).toHaveLength(20);
    expect(instance.store.total).toBe(10000);
    instance.store.next();
    await flushPromises();
    expect(instance.get).toHaveBeenCalledTimes(2);
    expect(instance.get.mock.calls[1][1].params.offset).toBe(20);
    expect(instance.result().data.value[0].metadata.name).toBe('upload-20');
    instance.close();
  });
  it('sends filters and sorting to the API, without filtering a partial page locally', async () => {
    const instance = panel();
    await flushPromises();
    instance.store.setFilter(Filter.Status, 'Completed');
    await flushPromises();
    expect(instance.get.mock.calls.at(-1)[1].params).toMatchObject({
      status: 'Completed',
      offset: 0,
    });
    expect(instance.result().data.value).toHaveLength(20);
    instance.close();
  });
  it('replaces the bounded page and total over WebSocket without HTTP or loading', async () => {
    const instance = panel();
    await flushPromises();
    const subscription = instance.subscription();
    expect(subscription).toMatchObject({
      backup: true,
      search: { limit: 20, offset: 0 },
      requestId: expect.any(String),
    });
    instance.deliver('pod-volumes:page', {
      ...subscription,
      page: { ...page(), total: 10001 },
    });
    await flushPromises();
    expect(instance.store.total).toBe(10001);
    expect(instance.result().data.value).toHaveLength(20);
    expect(instance.result().isFetching.value).toBe(false);
    expect(instance.get).toHaveBeenCalledTimes(1);
    expect(
      instance.io.emit.mock.calls.filter(
        ([event]) => event === 'pod-volumes:watch'
      )
    ).toHaveLength(1);
    instance.close();
  });
  it('ignores stale events after changing pages and after unmount', async () => {
    const instance = panel();
    await flushPromises();
    const previous = instance.subscription();
    instance.store.next();
    await flushPromises();
    instance.deliver('pod-volumes:page', {
      ...previous,
      page: { ...page(), total: 5 },
    });
    await flushPromises();
    expect(instance.store.total).toBe(10000);
    expect(instance.result().data.value[0].metadata.name).toBe('upload-20');
    const current = instance.subscription();
    instance.close();
    instance.deliver('pod-volumes:page', {
      ...current,
      page: { ...page(), total: 5 },
    });
    expect(instance.store.total).toBe(10000);
    expect(instance.io.emit).toHaveBeenCalledWith('pod-volumes:unwatch', {
      backup: true,
    });
    expect(instance.io.off.mock.calls.every((call) => call.length === 2)).toBe(
      true
    );
  });
  it('accepts a server-clamped offset after deleting the last page', async () => {
    const instance = panel();
    await flushPromises();
    instance.store.next();
    await flushPromises();
    instance.deliver('pod-volumes:page', {
      ...instance.subscription(),
      page: { ...page(0), total: 20 },
    });
    await flushPromises();
    expect(instance.store.offset).toBe(0);
    expect(instance.store.total).toBe(20);
    expect(instance.get).toHaveBeenCalledTimes(2);
    instance.close();
  });
  it('never polls and resynchronizes only the current page on reconnect/manual refresh', async () => {
    vi.useFakeTimers();
    try {
      const instance = panel();
      await flushPromises();
      await vi.advanceTimersByTimeAsync(60000);
      expect(instance.get).toHaveBeenCalledTimes(1);
      instance.deliver('disconnect');
      instance.deliver('connect');
      await flushPromises();
      expect(instance.get).toHaveBeenCalledTimes(2);
      await instance.result().refetch();
      await flushPromises();
      expect(instance.get).toHaveBeenCalledTimes(3);
      instance.close();
    } finally {
      vi.useRealTimers();
    }
  });
  it('does not request or subscribe without any operation read permission', async () => {
    vi.mocked(can).mockReturnValue(false);
    const instance = panel();
    await flushPromises();
    expect(instance.get).not.toHaveBeenCalled();
    expect(instance.subscription()).toBeUndefined();
    expect(instance.result().data.value).toEqual([]);
    instance.close();
  });
  it('keeps stream errors visible without starting polling', async () => {
    const instance = panel();
    await flushPromises();
    instance.deliver('pod-volumes:error', {
      ...instance.subscription(),
      code: 403,
    });
    await flushPromises();
    expect(instance.result().error.value).toBeInstanceOf(Error);
    expect(instance.get).toHaveBeenCalledTimes(1);
    instance.close();
  });
  it('commits the HTTP snapshot before immediate socket updates and starts idempotently', async () => {
    const instance = panel();
    instance.io.emit.mockImplementation((event, body) => {
      if (event === 'pod-volumes:watch')
        instance.deliver('pod-volumes:page', {
          ...body,
          page: { ...page(), total: 10002 },
        });
    });
    await flushPromises();
    instance.result().on();
    expect(instance.store.total).toBe(10002);
    expect(instance.io.on).toHaveBeenCalledTimes(4);
    expect(instance.get).toHaveBeenCalledTimes(1);
    instance.close();
  });
  it('shows partial source failures from both HTTP and WebSocket pages', async () => {
    const instance = panel(
      vi.fn(() =>
        Promise.resolve({
          data: { ...page(), issues: [{ plural: 'datauploads' }] },
        })
      )
    );
    await flushPromises();
    expect(instance.result().error.value).toBeInstanceOf(Error);
    instance.deliver('pod-volumes:page', {
      ...instance.subscription(),
      page: page(),
    });
    await flushPromises();
    expect(instance.result().error.value).toBeNull();
    instance.deliver('pod-volumes:page', {
      ...instance.subscription(),
      page: { ...page(), issues: [{ plural: 'podvolumebackups' }] },
    });
    await flushPromises();
    expect(instance.result().error.value).toBeInstanceOf(Error);
    instance.close();
  });
  it('caps a stored oversized page preference at one hundred', async () => {
    localStorage.setItem('list.limit', '10000');
    const instance = panel();
    await flushPromises();
    expect(instance.get.mock.calls[0][1].params.limit).toBe(100);
    expect(instance.result().data.value).toHaveLength(100);
    expect(instance.store.limit).toBe(100);
    instance.store.next();
    await flushPromises();
    expect(instance.get.mock.calls.at(-1)[1].params.offset).toBe(100);
    expect(instance.result().data.value[0].metadata.name).toBe('upload-100');
    instance.close();
  });
  it('does not subscribe when an HTTP request completes after disposal', async () => {
    let resolve: (value: unknown) => void;
    const instance = panel(
      vi.fn(
        () =>
          new Promise((done) => {
            resolve = done;
          })
      )
    );
    instance.close();
    resolve({ data: page() });
    await flushPromises();
    expect(instance.subscription()).toBeUndefined();
  });
});
