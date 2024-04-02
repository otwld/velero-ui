import { V1BackupRepository } from './v1BackupRepository';
import {KubernetesListObject} from "@kubernetes/client-node/dist/types";

export interface V1BackupRepositoryList
  extends KubernetesListObject<V1BackupRepository> {
  total?: number;
}
