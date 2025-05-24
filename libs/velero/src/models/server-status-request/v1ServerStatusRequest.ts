import { KubernetesObject } from '@kubernetes/client-node';
import { V1ObjectMeta } from '@kubernetes/client-node/dist/api';
import { V1Metadata } from '../shared';

export interface V1ServerStatusRequest extends KubernetesObject {
  metadata?: V1ObjectMeta & V1Metadata;
  spec?: V1ServerStatusRequestSpec;
  status?: V1ServerStatusRequestStatus;
}

export type V1ServerStatusRequestSpec = object;

export enum V1ServerStatusRequestPhase {
  New = 'New',
  Processed = 'Processed',
}

export interface V1PluginInfo {
  name: string;
  kind: string;
}

export interface V1ServerStatusRequestStatus {
  phase: V1ServerStatusRequestPhase;
  processedTimestamp?: string;
  serverVersion?: string;
  plugins: V1PluginInfo[];
}
