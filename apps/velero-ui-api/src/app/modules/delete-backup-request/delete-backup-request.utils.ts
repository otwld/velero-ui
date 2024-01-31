import { DeleteBackupRequest } from '../../shared/models/velero.models';
import { getApiVersion } from '../../shared/utils/velero.utils';
import { VELERO } from '../../shared/constants/velero.constants';

export const createDeleteBackupRequest = (
  name: string,
  namespace: string
): DeleteBackupRequest => ({
  apiVersion: getApiVersion(),
  kind: VELERO.KIND_DELETE_BACKUP_REQUEST,
  metadata: {
    name: name,
    namespace: namespace,
  },
  spec: {
    backupName: name,
  },
});
