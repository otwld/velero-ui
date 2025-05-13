import { Resources, V1ServerStatusRequest } from '@velero-ui/velero';
import { getApiVersion } from '@velero-ui-api/shared/utils/velero.utils';
import { generateUuidName } from '@velero-ui-api/shared/utils/uuid.utils';

export const createServerStatusRequest = (namespace): V1ServerStatusRequest => ({
  apiVersion: getApiVersion(),
  kind: Resources.SERVER_STATUS_REQUEST.kind,
  metadata: {
    name: generateUuidName('velero-ui'),
    namespace,
  },
  spec: {},
});
