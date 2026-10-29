import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import SnapshotLine from './SnapshotLine.vue';

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));

describe('archived snapshot line', () => {
  it('shows unknown state and size without inventing completion or zero bytes', () => {
    const wrapper = mount(SnapshotLine, {
      props: { snapshot: { type: 'CSI', name: 'content', phase: 'Unknown' } },
      global: {
        stubs: {
          Badge: { props: ['text'], template: '<span>{{ text }}</span>' },
        },
      },
    });
    expect(wrapper.text()).toContain('resource.phase.undefined');
    expect(wrapper.text()).toContain('podVolumes.unknownSize');
    expect(wrapper.text()).not.toContain('Completed');
    expect(wrapper.text()).not.toContain('0B');
  });

  it('distinguishes archived repository and provider snapshot identifiers', () => {
    const wrapper = mount(SnapshotLine, {
      props: {
        snapshot: {
          type: 'CSI',
          name: 'content',
          phase: 'Completed',
          snapshotDataMoved: true,
          dataMoverSnapshotID: 'repository-id',
          snapshotID: 'provider-id',
          size: 25,
        },
      },
      global: {
        stubs: {
          Badge: { props: ['text'], template: '<span>{{ text }}</span>' },
        },
      },
    });
    expect(wrapper.text()).toContain('podVolumes.dataMover');
    expect(wrapper.text()).toContain(
      'podVolumes.storageSnapshotID: provider-id'
    );
    expect(wrapper.text()).toContain('podVolumes.snapshotID: repository-id');
    expect(wrapper.text()).toContain('25B');
  });

  it('preserves namespace, PVC, driver errors and an explicitly measured empty size', () => {
    const wrapper = mount(SnapshotLine, {
      props: {
        snapshot: {
          type: 'CSI',
          name: 'snapshot',
          phase: 'Failed',
          namespace: 'app',
          volume: 'database',
          contentName: 'content',
          driver: 'csi.example',
          size: 0,
          message: 'driver failed',
        },
      },
      global: {
        stubs: {
          Badge: { props: ['text'], template: '<span>{{ text }}</span>' },
        },
      },
    });
    expect(wrapper.text()).toContain('app/database');
    expect(wrapper.text()).toContain('resource.phase.Failed');
    expect(wrapper.text()).toContain('csi.example');
    expect(wrapper.text()).toContain('content');
    expect(wrapper.text()).toContain('driver failed');
    expect(wrapper.text()).toContain('0B');
    expect(wrapper.text()).not.toContain('podVolumes.unknownSize');
  });
});
