import { flushPromises, mount } from '@vue/test-utils';
import { ref } from 'vue';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Resources, V1BackupPhase } from '@velero-ui/velero';
import PodVolumes from './PodVolumes.vue';
import { useVolumeOperations } from '../../composables/useVolumeOperations';

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));
vi.mock('vue-router', () => ({
  useRoute: () => ({ name: 'Backup', params: { name: 'daily' } }),
}));
vi.mock('../../utils/policy.utils', () => ({ can: () => true }));
vi.mock('../../composables/useVolumeOperations', () => ({
  useVolumeOperations: vi.fn(),
}));

function panel(result: object, movers: object[] = []) {
  vi.mocked(useVolumeOperations).mockImplementation(
    (resource) =>
      ({
        data: ref(resource === Resources.DATA_UPLOAD ? movers : []),
        error: ref(null),
        isFetching: ref(false),
      }) as ReturnType<typeof useVolumeOperations>
  );
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  const get = vi.fn().mockResolvedValue({ data: result });
  const wrapper = mount(PodVolumes, {
    props: {
      backup: {
        metadata: { name: 'daily', uid: 'daily-uid' },
        spec: {},
        status: {
          phase: V1BackupPhase.Completed,
          csiVolumeSnapshotsAttempted: 1,
        },
      },
    },
    global: {
      plugins: [[VueQueryPlugin, { queryClient: client }]],
      provide: { axios: { get } },
      stubs: {
        Badge: {
          props: ['text'],
          template: '<span class="badge">{{ text }}</span>',
        },
        SnapshotLine: {
          props: ['snapshot'],
          template: '<div class="snapshot">{{ snapshot.name }}</div>',
        },
        DataMoverLine: {
          props: ['operation', 'snapshot'],
          template:
            '<div class="mover">{{ operation.metadata.name }} {{ snapshot?.name }}</div>',
        },
        PodVolumeLine: true,
      },
    },
  });
  return {
    wrapper,
    get,
    close: () => {
      wrapper.unmount();
      client.clear();
    },
  };
}

beforeEach(() => vi.clearAllMocks());

describe('backup snapshot compatibility panel', () => {
  it('keeps available volumes visible and warns when another source failed', async () => {
    const instance = panel({
      items: [{ type: 'Native', name: 'pv', phase: 'Completed' }],
      issues: [{ source: 'csi', reason: 'error' }],
    });
    await flushPromises();
    expect(instance.wrapper.find('.snapshot').text()).toBe('pv');
    expect(instance.wrapper.text()).toContain('podVolumes.partial');
    expect(instance.wrapper.text()).toContain('podVolumes.sources.csi');
    expect(instance.wrapper.text()).not.toContain('global.noData');
    instance.close();
  });

  it('does not present missing metadata as an empty complete backup or zero known bytes', async () => {
    const instance = panel({
      items: [],
      issues: [{ source: 'volumeInfos', reason: 'unavailable' }],
    });
    await flushPromises();
    expect(instance.wrapper.text()).toContain('podVolumes.partial');
    expect(instance.wrapper.text()).toContain('podVolumes.unavailable');
    expect(instance.wrapper.text()).not.toContain('global.noData');
    instance.close();
  });

  it('joins archived moved snapshots to uploads by namespaced PVC without double counting', async () => {
    const instance = panel(
      {
        items: [
          {
            type: 'CSI',
            name: 'content',
            namespace: 'app',
            volume: 'db',
            snapshotDataMoved: true,
            phase: 'Completed',
            size: 100,
          },
        ],
        issues: [],
      },
      [
        {
          metadata: { name: 'upload' },
          spec: { sourceNamespace: 'app', sourcePVC: 'db' },
          status: { progress: { bytesDone: 25, totalBytes: 100 } },
        },
      ]
    );
    await flushPromises();
    expect(instance.wrapper.findAll('.snapshot')).toHaveLength(0);
    expect(instance.wrapper.find('.mover').text()).toContain('content');
    expect(instance.wrapper.find('.badge').text()).toBe('1');
    expect(instance.wrapper.findAll('.badge')[1].text()).toBe('25B');
    instance.close();
  });

  it('does not merge a different namespace or a separate retained CSI snapshot with an upload', async () => {
    const instance = panel(
      {
        items: [
          {
            type: 'CSI',
            name: 'other',
            namespace: 'other',
            volume: 'db',
            snapshotDataMoved: true,
            phase: 'Completed',
            size: 100,
          },
          {
            type: 'CSI',
            name: 'retained',
            namespace: 'app',
            volume: 'db',
            phase: 'Completed',
          },
        ],
        issues: [],
      },
      [
        {
          metadata: { name: 'upload' },
          spec: { sourceNamespace: 'app', sourcePVC: 'db' },
        },
      ]
    );
    await flushPromises();
    expect(instance.wrapper.findAll('.snapshot')).toHaveLength(2);
    expect(instance.wrapper.findAll('.badge')[1].text()).toContain(
      'podVolumes.unknownSize'
    );
    instance.close();
  });

  it('keeps live snapshot rows until archived metadata arrives after completion', async () => {
    const instance = panel({
      items: [
        { type: 'CSI', name: 'live-snapshot', phase: 'InProgress', size: 100 },
      ],
      issues: [],
    });
    await flushPromises();
    await instance.wrapper.setProps({
      backup: {
        metadata: { name: 'daily', uid: 'daily-uid' },
        spec: {},
        status: {
          phase: V1BackupPhase.InProgress,
          csiVolumeSnapshotsAttempted: 1,
        },
      },
    });
    await flushPromises();
    let resolve: (result: object) => void;
    instance.get.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        })
    );
    await instance.wrapper.setProps({
      backup: {
        metadata: { name: 'daily', uid: 'daily-uid' },
        spec: {},
        status: {
          phase: V1BackupPhase.Completed,
          csiVolumeSnapshotsAttempted: 1,
          completionTimestamp: '2026-10-25T00:00:00Z',
        },
      },
    });
    expect(instance.wrapper.find('.snapshot').text()).toBe('live-snapshot');
    resolve!({
      data: {
        items: [
          {
            type: 'CSI',
            name: 'archived-snapshot',
            phase: 'Completed',
            size: 100,
          },
        ],
        issues: [],
      },
    });
    await flushPromises();
    expect(instance.wrapper.findAll('.snapshot')).toHaveLength(1);
    expect(instance.wrapper.find('.snapshot').text()).toBe('archived-snapshot');
    instance.close();
  });
});
