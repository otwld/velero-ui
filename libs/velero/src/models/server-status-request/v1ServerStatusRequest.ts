import { KubernetesObject } from '@kubernetes/client-node';

export interface V1ServerStatusRequest extends KubernetesObject {
  spec?: V1ServerStatusRequestSpec;
  status?: V1ServerStatusRequestStatus;
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
