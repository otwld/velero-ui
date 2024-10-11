import { Resources, V1Backup, V1BackupSpec } from '@velero-ui/velero';
import { getApiVersion } from '@velero-ui-api/shared/utils/velero.utils';
import { generateDateName } from '@velero-ui-api/shared/utils/uuid.utils';

export const createBackup = (
  name: string,
  namespace: string,
  labels: Record<string, string> = {},
  body: V1BackupSpec,
): V1Backup => ({
  apiVersion: getApiVersion(),
  kind: Resources.BACKUP.kind,
  metadata: {
    name: generateDateName(name),
    namespace,
    labels,
  },
  spec: body,
});
