import { V1ObjectMeta } from '@kubernetes/client-node/dist/gen/model/v1ObjectMeta';

export interface DeleteBackupRequest {
  apiVersion: string;
  kind: string;
  metadata: V1ObjectMeta;
  spec: DeleteBackupRequestSpec;
}

export interface DeleteBackupRequestSpec {
  backupName: string;
}
