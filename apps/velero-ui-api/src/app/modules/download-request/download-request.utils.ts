import { getApiVersion } from '@velero-ui-api/shared/utils/velero.utils';
import {
  Ressources,
  V1DownloadRequest,
  V1DownloadTargetKind,
} from '@velero-ui/velero';
import { generateUuidName } from '@velero-ui-api/shared/utils/uuid.utils';

export const createDownloadRequest = (
  name: string,
  namespace: string,
  kind: V1DownloadTargetKind
): V1DownloadRequest => ({
  apiVersion: getApiVersion(),
  kind: Ressources.DOWNLOAD_REQUEST.kind,
  metadata: {
    name: generateUuidName(name),
    namespace,
  },
  spec: {
    target: {
      name,
      kind,
    },
  },
});
