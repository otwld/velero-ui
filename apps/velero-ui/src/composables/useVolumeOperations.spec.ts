import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { AxiosError } from 'axios';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { Resources, type V2alpha1DataUpload } from '@velero-ui/velero';
import { useVolumeOperations } from './useVolumeOperations';

const operation = (name = 'upload', parent = 'daily', uid = name) => ({
  metadata: { name, uid, labels: { 'velero.io/backup-name': parent } },
  status: { progress: { bytesDone: 25 } },
});
function panel(
  get = vi.fn().mockResolvedValue({
    data: { items: [operation()], metadata: { resourceVersion: '100' } },
  }),
  allowed = true,
  cached?: QueryClient
) {
  const name = ref('daily');
  const uid = ref<string | undefined>();
  const queryClient =
    cached ||
    new QueryClient({ defaultOptions: { queries: { gcTime: Infinity } } });
  const handlers = new Map<string, Set<(value?: unknown) => void>>();
  const io = {
    emit: vi.fn(),
    on: vi.fn((event, callback) => {
      if (!handlers.has(event)) handlers.set(event, new Set());
      handlers.get(event).add(callback);
    }),
    off: vi.fn((event, callback) => handlers.get(event)?.delete(callback)),
  };
  let result: ReturnType<typeof useVolumeOperations<V2alpha1DataUpload>>;
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useVolumeOperations<V2alpha1DataUpload>(
          Resources.DATA_UPLOAD,
          name,
          true,
          allowed,
          uid
        );
        return () => null;
      },
    }),
    {
      global: {
        plugins: [[VueQueryPlugin, { queryClient }]],
        provide: { axios: { get }, socketIo: { io } },
      },
    }
  );
  return {
    wrapper,
    name,
    uid,
    queryClient,
    io,
    get,
    result: () => result,
    deliver: (event: string, value?: unknown) =>
      handlers.get(event)?.forEach((callback) => callback(value)),
    subscription: () =>
      io.emit.mock.calls
        .filter(([event]) => event === 'volume-operations:watch')
        .at(-1)?.[1],
    close: () => {
      wrapper.unmount();
      queryClient.clear();
    },
  };
}
afterEach(() => vi.useRealTimers());
describe('parent-scoped volume operation watches', () => {
  it('requests only the parent operations from the server and switches parent/UID safely', async () => {
    const instance = panel();
    await flushPromises();
    expect(instance.get).toHaveBeenCalledWith(
      '/pod-volumes/operations/datauploads/daily',
      expect.objectContaining({ params: { uid: undefined } })
    );
    expect(instance.subscription()).toMatchObject({
      plural: 'datauploads',
      parent: 'daily',
      version: '100',
      requestId: expect.any(String),
    });
    const previous = instance.subscription();
    instance.name.value = 'other';
    instance.uid.value = 'other-uid';
    await flushPromises();
    expect(instance.get.mock.calls.at(-1)).toEqual([
      '/pod-volumes/operations/datauploads/other',
      expect.objectContaining({ params: { uid: 'other-uid' } }),
    ]);
    instance.deliver('volume-operations:event', {
      requestId: previous.requestId,
      phase: 'ADDED',
      object: operation('late'),
    });
    await flushPromises();
    expect(
      instance.result().data.value.map((item) => item.metadata.name)
    ).not.toContain('late');
    instance.close();
  });
  it('receives progress/additions/deletions over sockets without polling or loading', async () => {
    vi.useFakeTimers();
    const instance = panel();
    await flushPromises();
    const { requestId } = instance.subscription();
    instance.deliver('volume-operations:event', {
      requestId,
      phase: 'MODIFIED',
      object: { ...operation(), status: { progress: { bytesDone: 75 } } },
    });
    instance.deliver('volume-operations:event', {
      requestId,
      phase: 'ADDED',
      object: operation('second'),
    });
    await flushPromises();
    expect(instance.result().data.value[0].status.progress.bytesDone).toBe(75);
    expect(instance.result().data.value).toHaveLength(2);
    instance.deliver('volume-operations:event', {
      requestId,
      phase: 'DELETED',
      object: operation('second', 'daily', 'old-uid'),
    });
    await flushPromises();
    expect(instance.result().data.value).toHaveLength(2);
    instance.deliver('volume-operations:event', {
      requestId,
      phase: 'DELETED',
      object: operation('second'),
    });
    instance.deliver('volume-operations:event', {
      requestId,
      phase: 'ADDED',
      object: operation('unrelated', 'other'),
    });
    await flushPromises();
    expect(instance.result().data.value).toHaveLength(1);
    expect(instance.result().isFetching.value).toBe(false);
    await vi.advanceTimersByTimeAsync(60000);
    expect(instance.get).toHaveBeenCalledTimes(1);
    instance.close();
  });
  it('does not request, expose cached data or watch without permission', async () => {
    const client = new QueryClient();
    client.setQueryData(
      ['volume-operations', 'datauploads', 'daily', undefined],
      [operation()]
    );
    const instance = panel(vi.fn(), false, client);
    await flushPromises();
    expect(instance.get).not.toHaveBeenCalled();
    expect(instance.result().data.value).toEqual([]);
    expect(instance.subscription()).toBeUndefined();
    instance.close();
  });
  it('keeps absent data mover CRDs empty without polling or retrying', async () => {
    vi.useFakeTimers();
    const missing = new AxiosError('missing');
    missing.response = { status: 404 } as typeof missing.response;
    const instance = panel(vi.fn().mockRejectedValue(missing));
    await flushPromises();
    await vi.advanceTimersByTimeAsync(60000);
    expect(instance.result().data.value).toEqual([]);
    expect(instance.result().error.value).toBeNull();
    expect(instance.get).toHaveBeenCalledTimes(1);
    expect(instance.subscription()).toBeUndefined();
    instance.close();
  });
  it('refreshes only the scoped resource on reconnect and expiration', async () => {
    const instance = panel();
    await flushPromises();
    instance.deliver('volume-operations:event', {
      requestId: instance.subscription().requestId,
      phase: 'ERROR',
      code: 410,
    });
    await flushPromises();
    expect(instance.get).toHaveBeenCalledTimes(2);
    instance.deliver('disconnect');
    instance.deliver('connect');
    await flushPromises();
    expect(instance.get).toHaveBeenCalledTimes(3);
    expect(instance.subscription().parent).toBe('daily');
    instance.close();
  });
  it.each([408, 503])(
    'recovers a transient scoped HTTP failure (%s) before starting the watch',
    async (status) => {
      vi.useFakeTimers();
      const transient = new AxiosError('temporarily unavailable');
      transient.response = { status } as typeof transient.response;
      const get = vi
        .fn()
        .mockRejectedValueOnce(transient)
        .mockResolvedValue({
          data: {
            items: [operation()],
            metadata: { resourceVersion: 'recovered' },
          },
        });
      const instance = panel(get);
      await flushPromises();
      expect(instance.subscription()).toBeUndefined();
      await vi.advanceTimersByTimeAsync(1000);
      await flushPromises();
      expect(get).toHaveBeenCalledTimes(2);
      expect(instance.subscription().version).toBe('recovered');
      await vi.advanceTimersByTimeAsync(60000);
      expect(get).toHaveBeenCalledTimes(2);
      instance.close();
    }
  );
  it('resumes after a 410 followed by a prolonged HTTP outage without reconnecting the socket', async () => {
    vi.useFakeTimers();
    const instance = panel();
    await flushPromises();
    const transient = new AxiosError('temporarily unavailable');
    transient.response = { status: 503 } as typeof transient.response;
    instance.get.mockRejectedValue(transient);
    instance.deliver('volume-operations:event', {
      requestId: instance.subscription().requestId,
      phase: 'ERROR',
      code: 410,
    });
    await flushPromises();
    await vi.advanceTimersByTimeAsync(15000);
    expect(instance.result().error.value).toBeTruthy();
    const failedCalls = instance.get.mock.calls.length;
    instance.get.mockResolvedValue({
      data: {
        items: [operation()],
        metadata: { resourceVersion: 'recovered' },
      },
    });
    await vi.advanceTimersByTimeAsync(30000);
    await flushPromises();
    expect(instance.get.mock.calls.length).toBeGreaterThan(failedCalls);
    expect(instance.subscription().version).toBe('recovered');
    expect(instance.result().error.value).toBeNull();
    instance.deliver('volume-operations:event', {
      requestId: instance.subscription().requestId,
      phase: 'MODIFIED',
      object: { ...operation(), status: { progress: { bytesDone: 75 } } },
    });
    await flushPromises();
    expect(instance.result().data.value[0].status.progress.bytesDone).toBe(75);
    const recoveredCalls = instance.get.mock.calls.length;
    await vi.advanceTimersByTimeAsync(120000);
    expect(instance.get).toHaveBeenCalledTimes(recoveredCalls);
    instance.close();
  });
  it('backs off retries to thirty seconds while keeping the outage visible', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const transient = new AxiosError('temporarily unavailable');
    transient.response = { status: 503 } as typeof transient.response;
    const attempts: number[] = [];
    const instance = panel(
      vi.fn(() => {
        attempts.push(Date.now());
        return Promise.reject(transient);
      })
    );
    await flushPromises();
    await vi.advanceTimersByTimeAsync(91000);
    expect(attempts).toEqual([0, 1000, 3000, 7000, 15000, 31000, 61000, 91000]);
    expect(instance.result().error.value).toBeTruthy();
    expect(instance.subscription()).toBeUndefined();
    instance.close();
  });
  it('cancels scheduled retries when the parent changes', async () => {
    vi.useFakeTimers();
    const transient = new AxiosError('temporarily unavailable');
    transient.response = { status: 503 } as typeof transient.response;
    const get = vi.fn((route: string) =>
      route.endsWith('/daily')
        ? Promise.reject(transient)
        : Promise.resolve({
            data: {
              items: [operation('other-upload', 'other')],
              metadata: { resourceVersion: 'other' },
            },
          })
    );
    const instance = panel(get);
    await flushPromises();
    instance.name.value = 'other';
    await flushPromises();
    expect(instance.subscription()).toMatchObject({
      parent: 'other',
      version: 'other',
    });
    expect(instance.result().error.value).toBeNull();
    await vi.advanceTimersByTimeAsync(120000);
    expect(get.mock.calls.map(([route]) => route)).toEqual([
      '/pod-volumes/operations/datauploads/daily',
      '/pod-volumes/operations/datauploads/other',
    ]);
    instance.close();
  });
  it('cancels scheduled retries on unmount', async () => {
    vi.useFakeTimers();
    const transient = new AxiosError('temporarily unavailable');
    transient.response = { status: 503 } as typeof transient.response;
    const instance = panel(vi.fn().mockRejectedValue(transient));
    await flushPromises();
    instance.close();
    await vi.advanceTimersByTimeAsync(120000);
    expect(instance.get).toHaveBeenCalledTimes(1);
    expect(instance.subscription()).toBeUndefined();
  });
  it.each([403, 404])(
    'stops transient retries when the API returns a terminal %s',
    async (status) => {
      vi.useFakeTimers();
      const transient = new AxiosError('temporarily unavailable');
      transient.response = { status: 503 } as typeof transient.response;
      const terminal = new AxiosError('terminal');
      terminal.response = { status } as typeof terminal.response;
      const get = vi
        .fn()
        .mockRejectedValueOnce(transient)
        .mockRejectedValue(terminal);
      const instance = panel(get);
      await flushPromises();
      await vi.advanceTimersByTimeAsync(1000);
      await flushPromises();
      expect(instance.result().error.value).toBe(
        status === 404 ? null : terminal
      );
      await vi.advanceTimersByTimeAsync(120000);
      expect(get).toHaveBeenCalledTimes(2);
      expect(instance.subscription()).toBeUndefined();
      instance.close();
    }
  );
  it('exposes permission errors without retrying or subscribing', async () => {
    const denied = new AxiosError('denied');
    denied.response = { status: 403 } as typeof denied.response;
    const instance = panel(vi.fn().mockRejectedValue(denied));
    await flushPromises();
    expect(instance.result().error.value).toBe(denied);
    expect(instance.subscription()).toBeUndefined();
    instance.close();
  });
  it('commits the HTTP snapshot before accepting synchronous watch events', async () => {
    const instance = panel();
    instance.io.emit.mockImplementation((event, body) => {
      if (event === 'volume-operations:watch')
        instance.deliver('volume-operations:event', {
          requestId: body.requestId,
          phase: 'ADDED',
          object: operation('instant'),
        });
    });
    await flushPromises();
    expect(instance.result().data.value).toHaveLength(2);
    instance.close();
  });
  it('unsubscribes only its stream and removes its exact callbacks on unmount', async () => {
    const instance = panel();
    await flushPromises();
    const { requestId } = instance.subscription();
    instance.close();
    expect(instance.io.emit).toHaveBeenCalledWith('volume-operations:unwatch', {
      requestId,
    });
    expect(instance.io.off.mock.calls.every((call) => call.length === 2)).toBe(
      true
    );
  });
  it('never subscribes when a pending HTTP response arrives after unmount', async () => {
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
    resolve({
      data: { items: [operation()], metadata: { resourceVersion: 'late' } },
    });
    await flushPromises();
    expect(instance.subscription()).toBeUndefined();
  });
});
