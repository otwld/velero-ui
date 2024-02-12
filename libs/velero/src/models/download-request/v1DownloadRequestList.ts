import { V1DownloadRequest } from './v1DownloadRequest';
import { KubernetesListObject } from '@kubernetes/client-node/dist/types';

export interface V1DownloadRequestList
  extends KubernetesListObject<V1DownloadRequest> {
  total?: number;
}
