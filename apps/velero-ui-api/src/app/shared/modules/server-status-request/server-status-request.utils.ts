import { Ressources, V1ServerStatusRequest } from '@velero-ui/velero';
import { getApiVersion } from '../../utils/velero.utils';
import { generateUuidName } from '../../utils/uuid.utils';

export const createServerStatusRequest = (namespace): V1ServerStatusRequest => ({
  apiVersion: getApiVersion(),
  kind: Ressources.SERVER_STATUS_REQUEST.kind,
  metadata: {
    name: generateUuidName('velero-ui'),
    namespace,
  },
  spec: {},
});
