import { shallowMount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import {
  V2alpha1DataUploadPhase,
  V2alpha1DataUploadSnapshotType,
  V2alpha1DataDownloadPhase,
} from '@velero-ui/velero';
import DataMoverLine from './DataMoverLine.vue';

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));

const spec = {
  sourceNamespace: 'app',
  sourcePVC: 'database',
  snapshotType: V2alpha1DataUploadSnapshotType.CSI,
  backupStorageLocation: 'default',
  operationTimeout: '10m',
  csiSnapshot: {
    volumeSnapshot: 'snapshot',
    storageClass: 'storage',
    snapshotClass: 'snapshot-class',
  },
};

describe('data mover volume line', () => {
  it('shows source PVC, snapshot, repository ID and live progress', () => {
    const wrapper = shallowMount(DataMoverLine, {
      props: {
        operation: {
          metadata: { name: 'upload' },
          spec,
          status: {
            phase: V2alpha1DataUploadPhase.InProgress,
            snapshotID: 'repository-id',
            progress: { bytesDone: 25, totalBytes: 100 },
          },
        },
      },
    });
    expect(wrapper.text()).toContain('app/database');
    expect(wrapper.text()).toContain('snapshot');
    expect(wrapper.text()).toContain('repository-id');
    expect(
      wrapper.get('[role="progressbar"]').attributes('aria-valuenow')
    ).toBe('25');
  });
  it('renders early uploads without status and zero-sized volumes', () => {
    const wrapper = shallowMount(DataMoverLine, {
      props: { operation: { spec } },
    });
    expect(wrapper.find('[role="progressbar"]').exists()).toBe(false);
    expect(wrapper.text()).toContain('app/database');
  });
  it('shows mover failures and snapshot failures independently', () => {
    const wrapper = shallowMount(DataMoverLine, {
      props: {
        operation: {
          spec,
          status: {
            phase: V2alpha1DataUploadPhase.Failed,
            message: 'upload failed',
          },
        },
        snapshot: {
          type: 'CSI',
          name: 'snapshot',
          phase: 'Failed',
          message: 'driver failed',
        },
      },
    });
    expect(wrapper.text()).toContain('upload failed');
    expect(wrapper.text()).toContain('driver failed');
  });
  it('shows the restored PVC in its target namespace', () => {
    const wrapper = shallowMount(DataMoverLine, {
      props: {
        operation: {
          spec: {
            targetVolume: { pvc: 'database', pv: 'pv', namespace: 'restored' },
            sourceNamespace: 'app',
            snapshotID: 'repository-id',
            backupStorageLocation: 'default',
            operationTimeout: '10m',
            nodeOS: 'linux' as never,
          },
          status: { phase: V2alpha1DataDownloadPhase.Completed },
        },
      },
    });
    expect(wrapper.text()).toContain('restored/database');
    expect(wrapper.text()).toContain('repository-id');
  });
});
