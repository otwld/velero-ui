import {
  BackupCSISnapshot,
  BackupCSISnapshotContent,
  BackupNativeSnapshot,
  BackupSnapshot,
  BackupVolumeInfo,
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

const known = (value?: string) =>
  value && value !== 'unknown' ? value : undefined;

/** Go fields without json tags are serialized as Phase / ReadyToUse. */
export function volumeInfoSnapshots(
  infos: BackupVolumeInfo[]
): BackupSnapshot[] {
  return infos
    .filter(
      (info) =>
        !info.skipped &&
        ['NativeSnapshot', 'CSISnapshot'].includes(info.backupMethod)
    )
    .map((info) => {
      const csi = info.csiSnapshotInfo;
      const native = info.nativeSnapshotInfo;
      const movement = info.snapshotDataMovementInfo;
      const moved = info.snapshotDataMoved === true;
      const phase =
        info.result === 'failed'
          ? 'Failed'
          : (moved ? movement?.Phase : native?.Phase) ||
            (info.result === 'succeeded'
              ? 'Completed'
              : !moved && csi?.ReadyToUse === true
                ? 'Completed'
                : 'Unknown');
      const rawSize = moved ? movement?.size : csi?.size;
      return {
        name: known(csi?.vscName) || info.pvName || info.pvcName || 'unknown',
        namespace: info.pvcNamespace,
        volume: info.pvcName || info.pvName,
        pvName: info.pvName,
        type: info.backupMethod === 'CSISnapshot' ? 'CSI' : 'Native',
        phase,
        snapshotDataMoved: info.snapshotDataMoved,
        snapshotID: known(csi?.snapshotHandle || native?.snapshotHandle),
        dataMoverSnapshotID: known(movement?.snapshotHandle),
        contentName: known(csi?.vscName),
        driver: known(csi?.driver),
        // Omitted early fields and Go default zero are not evidence of a measured size.
        size: Number.isFinite(rawSize) && rawSize > 0 ? rawSize : undefined,
      };
    });
}

export function mergeSnapshots(
  current: BackupSnapshot[],
  legacy: BackupSnapshot[]
): BackupSnapshot[] {
  const result = [...current];
  for (const item of legacy) {
    const index = result.findIndex(
      (other) =>
        other.type === item.type &&
        ((other.snapshotID &&
          item.snapshotID &&
          other.snapshotID === item.snapshotID) ||
          (other.contentName && other.contentName === item.contentName) ||
          (other.pvName && other.pvName === item.volume) ||
          (other.volume &&
            other.volume === item.volume &&
            other.namespace === item.namespace))
    );
    if (index < 0) result.push(item);
    else {
      const original = result[index];
      // Enrich historical incomplete entries without overwriting current known state.
      result[index] = {
        ...item,
        ...Object.fromEntries(
          Object.entries(original).filter(([, v]) => v !== undefined)
        ),
      } as BackupSnapshot;
      if (original.phase === 'Unknown' && !original.snapshotDataMoved)
        result[index].phase = item.phase;
      if (original.snapshotDataMoved) result[index].size = original.size;
    }
  }
  return result;
}
