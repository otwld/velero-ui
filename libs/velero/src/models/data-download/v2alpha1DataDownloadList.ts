import type { KubernetesListObject } from '@kubernetes/client-node/dist/types';
import type { V2alpha1DataDownload } from './v2alpha1DataDownload';

export interface V2alpha1DataDownloadList
  extends KubernetesListObject<V2alpha1DataDownload> {
  total?: number;
}
