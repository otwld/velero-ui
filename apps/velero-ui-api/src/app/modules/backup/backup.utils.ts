import { DeleteBackupRequest } from '../../shared/models/velero.models';
import { getApiVersion } from '../../shared/utils/velero.utils';
import { VELERO } from '../../shared/constants/velero.constants';

export const createBackupRequest = (spec: any, namespace: string) => ({
});

export const createBackupRestoreRequest = (
  name: string,
  namespace: string,
  kind: string
) => ({});

export const createBackupDownloadRequest = (
  name: string,
  namespace: string,
  kind: string
) => ({});
