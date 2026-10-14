import {
  BackupCSISnapshot,
  BackupCSISnapshotContent,
  BackupNativeSnapshot,
  BackupSnapshot,
} from '@velero-ui/velero';

export function csiSnapshots(
  snapshots: BackupCSISnapshot[],
  contents: BackupCSISnapshotContent[]
): BackupSnapshot[] {
  return contents
    .map((content): BackupSnapshot => {
      const snapshot = snapshots.find(
        (item) =>
          item.status?.boundVolumeSnapshotContentName ===
            content.metadata?.name ||
          (item.metadata?.name === content.spec?.volumeSnapshotRef?.name &&
            item.metadata?.namespace ===
              content.spec?.volumeSnapshotRef?.namespace)
      );
      const message =
        snapshot?.status?.error?.message || content.status?.error?.message;
      const ready = snapshot?.status?.readyToUse ?? content.status?.readyToUse;
      return {
        name:
          snapshot?.metadata?.name ||
          content.spec?.volumeSnapshotRef?.name ||
          content.metadata?.name,
        namespace:
          snapshot?.metadata?.namespace ||
          content.spec?.volumeSnapshotRef?.namespace,
        volume: snapshot?.spec?.source?.persistentVolumeClaimName,
        type: 'CSI',
        phase: message ? 'Failed' : ready ? 'Completed' : 'InProgress',
        snapshotID:
          content.status?.snapshotHandle ||
          content.spec?.source?.snapshotHandle,
        contentName: content.metadata?.name,
        driver: content.spec?.driver,
        size: content.status?.restoreSize,
        message,
      };
    })
    .concat(
      snapshots
        .filter(
          (snapshot) =>
            !contents.some(
              (content) =>
                snapshot.status?.boundVolumeSnapshotContentName ===
                  content.metadata?.name ||
                (snapshot.metadata?.name ===
                  content.spec?.volumeSnapshotRef?.name &&
                  snapshot.metadata?.namespace ===
                    content.spec?.volumeSnapshotRef?.namespace)
            )
        )
        .map((snapshot): BackupSnapshot => ({
          name: snapshot.metadata?.name,
          namespace: snapshot.metadata?.namespace,
          volume: snapshot.spec?.source?.persistentVolumeClaimName,
          type: 'CSI',
          phase: snapshot.status?.error?.message
            ? 'Failed'
            : snapshot.status?.readyToUse
              ? 'Completed'
              : 'InProgress',
          contentName: snapshot.status?.boundVolumeSnapshotContentName,
          message: snapshot.status?.error?.message,
        }))
    );
}

export function nativeSnapshots(
  snapshots: BackupNativeSnapshot[]
): BackupSnapshot[] {
  return snapshots.map((snapshot) => ({
    name: snapshot.spec?.persistentVolumeName,
    volume: snapshot.spec?.persistentVolumeName,
    type: 'Native',
    phase: snapshot.status?.phase || 'New',
    snapshotID: snapshot.status?.providerSnapshotID,
  }));
}
