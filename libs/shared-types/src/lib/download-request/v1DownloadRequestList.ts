import { V1ListMeta } from '@kubernetes/client-node';
import { V1DownloadRequest } from './v1DownloadRequest';

export interface V1DownloadRequestList {
  apiVersion: string;
  total?: number;
  items: V1DownloadRequest[];
  kind: string;
  metadata: V1ListMeta;
}
