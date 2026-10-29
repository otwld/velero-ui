import {
  csiSnapshots,
  nativeSnapshots,
  volumeInfoSnapshots,
} from './backup-snapshots.utils';

describe('backup snapshot metadata', () => {
  const snapshot = {
    metadata: { name: 'snapshot', namespace: 'app' },
    spec: { source: { persistentVolumeClaimName: 'database' } },
    status: { boundVolumeSnapshotContentName: 'content', readyToUse: true },
  };
  const content = {
    metadata: { name: 'content' },
    spec: {
      driver: 'csi.example',
      volumeSnapshotRef: { name: 'snapshot', namespace: 'app' },
    },
    status: {
      snapshotHandle: 'provider-id',
      restoreSize: 1024,
      readyToUse: true,
    },
  };

  it('joins CSI objects to recover PVC, provider ID, driver and size', () => {
    expect(csiSnapshots([snapshot], [content])).toEqual([
      expect.objectContaining({
        name: 'snapshot',
        namespace: 'app',
        volume: 'database',
        type: 'CSI',
        phase: 'Completed',
        snapshotID: 'provider-id',
        size: 1024,
        driver: 'csi.example',
      }),
    ]);
  });
  it('shows snapshots waiting for content binding', () => {
    expect(csiSnapshots([{ ...snapshot, status: undefined }], [])).toEqual([
      expect.objectContaining({ phase: 'InProgress', volume: 'database' }),
    ]);
  });
  it('preserves snapshot errors even when a content is ready', () => {
    expect(
      csiSnapshots(
        [
          {
            ...snapshot,
            status: {
              ...snapshot.status,
              error: { message: 'snapshot failed' },
            },
          },
        ],
        [content]
      )[0]
    ).toMatchObject({ phase: 'Failed', message: 'snapshot failed' });
  });
  it('keeps content details after a temporary snapshot is removed', () => {
    expect(csiSnapshots([], [content])[0]).toMatchObject({
      name: 'snapshot',
      namespace: 'app',
      snapshotID: 'provider-id',
    });
  });
  it('does not join snapshots in different namespaces', () => {
    expect(
      csiSnapshots(
        [
          {
            ...snapshot,
            status: undefined,
            metadata: { name: 'snapshot', namespace: 'other' },
          },
        ],
        [content]
      )
    ).toHaveLength(2);
  });
  it('handles native snapshot status and missing optional metadata', () => {
    expect(
      nativeSnapshots([
        { spec: { persistentVolumeName: 'pv' }, status: { phase: 'Failed' } },
      ])[0]
    ).toMatchObject({
      name: 'pv',
      volume: 'pv',
      phase: 'Failed',
      type: 'Native',
    });
    expect(csiSnapshots([{ metadata: { name: 'new' } }], [])).toHaveLength(1);
  });
});

describe('versioned volume info', () => {
  it('preserves incomplete 1.13 state instead of inventing success or zero size', () => {
    expect(
      volumeInfoSnapshots([
        {
          backupMethod: 'CSISnapshot',
          pvcName: 'data',
          snapshotDataMoved: true,
          csiSnapshotInfo: {
            snapshotHandle: 'unknown',
            size: 0,
            vscName: 'unknown',
          },
        },
      ])[0]
    ).toMatchObject({ phase: 'Unknown', snapshotDataMoved: true });
    expect(
      volumeInfoSnapshots([
        {
          backupMethod: 'CSISnapshot',
          snapshotDataMoved: true,
          csiSnapshotInfo: { size: 1024 },
        },
      ])[0].size
    ).toBeUndefined();
  });
  it('preserves PascalCase modern states and data mover identity', () => {
    expect(
      volumeInfoSnapshots([
        {
          backupMethod: 'CSISnapshot',
          pvcName: 'data',
          result: 'failed',
          snapshotDataMoved: true,
          snapshotDataMovementInfo: {
            snapshotHandle: 'repo',
            size: 12,
            Phase: 'Failed',
          },
          csiSnapshotInfo: { snapshotHandle: 'provider', size: 100 },
        },
      ])[0]
    ).toMatchObject({
      phase: 'Failed',
      snapshotID: 'provider',
      dataMoverSnapshotID: 'repo',
      size: 12,
    });
  });
});
