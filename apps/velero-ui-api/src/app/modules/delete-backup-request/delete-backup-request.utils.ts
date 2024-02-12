import { getApiVersion } from '@velero-ui-api/shared/utils/velero.utils';
import { Ressources, V1DeleteBackupRequest } from '@velero-ui/velero';
import { generateUuidName } from '@velero-ui-api/shared/utils/uuid.utils';

export const createDeleteBackupRequest = (
  name: string,
  namespace: string
): V1DeleteBackupRequest => ({
  apiVersion: getApiVersion(),
  kind: Ressources.DELETE_BACKUP_REQUEST.kind,
  metadata: {
    name: generateUuidName(name),
    namespace,
  },
  spec: {
    backupName: name,
  },
});
