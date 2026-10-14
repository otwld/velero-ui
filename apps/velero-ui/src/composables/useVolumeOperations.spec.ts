import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { AxiosError } from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { Resources, type V2alpha1DataUpload } from '@velero-ui/velero';
import { useVolumeOperations } from './useVolumeOperations';

function panel(get: ReturnType<typeof vi.fn>, allowed = true) {
  const name = ref('daily');
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  let result: ReturnType<typeof useVolumeOperations<V2alpha1DataUpload>>;
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useVolumeOperations<V2alpha1DataUpload>(
          Resources.DATA_UPLOAD,
          name,
          true,
          allowed
        );
        return () => null;
      },
    }),
    {
      global: {
        plugins: [[VueQueryPlugin, { queryClient }]],
        provide: { axios: { get } },
      },
    }
  );
  return { wrapper, name, queryClient, result: () => result };
}

describe('volume operation queries', () => {
  it('keeps detail queries scoped to the parent and refreshes on parent changes', async () => {
    const items = [
      {
        metadata: {
          name: 'daily-1',
          labels: { 'velero.io/backup-name': 'daily' },
        },
      },
      {
        metadata: {
          name: 'daily-other-1',
          labels: { 'velero.io/backup-name': 'daily-other' },
        },
      },
    ];
    const get = vi.fn().mockResolvedValue({ data: { items } });
    const instance = panel(get);
    await flushPromises();
    expect(instance.result().data.value).toEqual([items[0]]);
    instance.name.value = 'daily-other';
    await flushPromises();
    expect(instance.result().data.value).toEqual([items[1]]);
    expect(get).toHaveBeenCalledTimes(2);
    instance.wrapper.unmount();
    instance.queryClient.clear();
  });
  it('does not request resources without read permission', async () => {
    const get = vi.fn();
    const instance = panel(get, false);
    await flushPromises();
    expect(get).not.toHaveBeenCalled();
    instance.wrapper.unmount();
    instance.queryClient.clear();
  });
  it('treats absent data mover CRDs as empty', async () => {
    const error = new AxiosError('Not found');
    error.response = { status: 404 } as typeof error.response;
    const instance = panel(vi.fn().mockRejectedValue(error));
    await flushPromises();
    expect(instance.result().data.value).toEqual([]);
    expect(instance.result().error.value).toBeNull();
    instance.wrapper.unmount();
    instance.queryClient.clear();
  });
  it('refreshes progress while mounted and stops polling after unmount', async () => {
    vi.useFakeTimers();
    const item = {
      metadata: { labels: { 'velero.io/backup-name': 'daily' } },
      status: { progress: { bytesDone: 25 } },
    };
    const get = vi.fn().mockResolvedValue({ data: { items: [item] } });
    const instance = panel(get);
    await vi.advanceTimersByTimeAsync(0);
    expect(instance.result().data.value[0].status.progress.bytesDone).toBe(25);
    get.mockResolvedValue({
      data: { items: [{ ...item, status: { progress: { bytesDone: 75 } } }] },
    });
    await vi.advanceTimersByTimeAsync(5000);
    expect(instance.result().data.value[0].status.progress.bytesDone).toBe(75);
    instance.wrapper.unmount();
    await vi.advanceTimersByTimeAsync(5000);
    expect(get).toHaveBeenCalledTimes(2);
    instance.queryClient.clear();
    vi.useRealTimers();
  });
});
