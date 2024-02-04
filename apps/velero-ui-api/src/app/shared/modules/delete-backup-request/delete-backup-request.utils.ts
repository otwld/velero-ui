import { getApiVersion } from '../../utils/velero.utils';
import { Ressources, V1DeleteBackupRequest } from '@velero-ui/velero';
import { generateUuidName } from '../../utils/uuid.utils';

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
