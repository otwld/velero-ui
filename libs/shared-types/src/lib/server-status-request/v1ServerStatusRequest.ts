import { V1ObjectMeta } from '@kubernetes/client-node/dist/gen/model/v1ObjectMeta';

export interface V1ServerStatusRequest {
  apiVersion: string;
  kind: string;
  metadata: V1ObjectMeta;
  spec: V1ServerStatusRequestSpec;
  status: V1ServerStatusRequestStatus;
}

export interface V1ServerStatusRequestSpec {}

export const enum V1ServerStatusRequestPhase {
  New = 'New',
  Processed = 'Processed',
}

export interface V1PluginInfo {
  name: string;
  kind: string;
}

export interface V1ServerStatusRequestStatus {
  phase: V1ServerStatusRequestPhase;
  processedTimestamp?: Date;
  serverVersion?: string;
  plugins: V1PluginInfo[];
}
