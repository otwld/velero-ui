import {
  Resource,
  Resources,
  V1BackupSpec,
  V1BackupStorageLocationSpec,
  V1DeleteBackupRequestSpec,
  V1DownloadRequestSpec,
  V1RestoreSpec,
  V1ScheduleSpec,
  V1ServerStatusRequestSpec,
  V1VolumeSnapshotLocationSpec,
} from '@velero-ui/velero';
import { getApiVersion } from '@velero-ui-api/shared/utils/velero.utils';
import {
  generateDateName,
  generateUuidName,
} from '@velero-ui-api/shared/utils/uuid.utils';
import { KubernetesObject } from '@kubernetes/client-node';

const generateNameType = (kind: string, name: string): string => {
  switch (kind) {
    case Resources.BACKUP.kind:
    case Resources.RESTORE.kind:
      return generateDateName(name);
    case Resources.DELETE_BACKUP_REQUEST.kind:
    case Resources.DOWNLOAD_REQUEST.kind:
    case Resources.SERVER_STATUS_REQUEST.kind:
      return generateUuidName(name);
    default:
      return name;
  }
};

export const createK8sCustomObject = (
  name: string,
  namespace: string,
  resource: Resource,
  labels: Record<string, string> = {},
  body:
    | V1ScheduleSpec
    | V1BackupSpec
    | V1RestoreSpec
    | V1BackupStorageLocationSpec
    | V1VolumeSnapshotLocationSpec
    | V1DownloadRequestSpec
    | V1DeleteBackupRequestSpec
    | V1ServerStatusRequestSpec
): KubernetesObject & { spec: object } => ({
  apiVersion: getApiVersion(),
  kind: resource.kind,
  metadata: {
    name: generateNameType(resource.kind, name),
    namespace,
    labels,
  },
  spec: body,
});

export const patchK8sCustomObjectSpec = (
  spec:
    | V1ScheduleSpec
    | V1BackupStorageLocationSpec
    | V1VolumeSnapshotLocationSpec
) => [
  {
    op: 'replace',
    path: '/spec',
    value: spec,
  },
];
