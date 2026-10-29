import type { KubernetesListObject } from '@kubernetes/client-node/dist/types';
import type { V2alpha1DataUpload } from './v2alpha1DataUpload';

export interface V2alpha1DataUploadList
  extends KubernetesListObject<V2alpha1DataUpload> {
  total?: number;
}
