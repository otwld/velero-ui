import type {
  V1DataMoveOperationProgress,
  V1PodVolumeBackup,
  V1PodVolumeRestore,
  V2alpha1DataUpload,
  V2alpha1DataDownload,
} from '@velero-ui/velero';

export type VolumeOperation =
  | V1PodVolumeBackup
  | V1PodVolumeRestore
  | V2alpha1DataUpload
  | V2alpha1DataDownload;

export function belongsToParent(
  volume: VolumeOperation,
  name: string,
  backup: boolean,
  uid?: string
): boolean {
  const parentUID =
    volume.metadata?.labels?.[
      backup ? 'velero.io/backup-uid' : 'velero.io/restore-uid'
    ];
  if (uid && parentUID) return uid === parentUID;
  const owner = volume.metadata?.ownerReferences?.find(
    (reference) => reference.kind === (backup ? 'Backup' : 'Restore')
  );
  if (owner) return owner.name === name && (!uid || owner.uid === uid);
  const label =
    volume.metadata?.labels?.[
      backup ? 'velero.io/backup-name' : 'velero.io/restore-name'
    ];
  if (label !== undefined) return label === name;
  // Older filesystem backups carry the backup name in tags.
  return (
    backup &&
    'tags' in (volume.spec || {}) &&
    (volume as V1PodVolumeBackup).spec?.tags?.backup === name
  );
}

export function progressPercent(
  progress?: V1DataMoveOperationProgress
): number {
  const total = progress?.totalBytes || 0;
  const done = progress?.bytesDone || 0;
  if (!Number.isFinite(total) || !Number.isFinite(done) || total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((done * 100) / total)));
}
