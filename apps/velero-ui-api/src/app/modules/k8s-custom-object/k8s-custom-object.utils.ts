import {
  Resource,
  Resources,
  V1BackupSpec,
  V1BackupStorageLocationSpec,
  V1RestoreSpec,
  V1ScheduleSpec,
  V1VolumeSnapshotLocationSpec,
} from '@velero-ui/velero';
import { getApiVersion } from '@velero-ui-api/shared/utils/velero.utils';
import { generateDateName } from '@velero-ui-api/shared/utils/uuid.utils';
import { KubernetesObjectWithSpec } from '@kubernetes/client-node/dist/types';

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
    | V1VolumeSnapshotLocationSpec,
): KubernetesObjectWithSpec => ({
  apiVersion: getApiVersion(),
  kind: resource.kind,
  metadata: {
    name:
      resource.kind === Resources.BACKUP.kind ||
      resource.kind === Resources.RESTORE.kind
        ? generateDateName(name)
        : name,
    namespace,
    labels,
  },
  spec: body,
});

export const patchK8sCustomObjectSpec = (
  spec:
    | V1ScheduleSpec
    | V1BackupStorageLocationSpec
    | V1VolumeSnapshotLocationSpec,
) => [
  {
    op: 'replace',
    path: '/spec',
    value: spec,
  },
];
