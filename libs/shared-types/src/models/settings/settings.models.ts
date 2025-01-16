export enum ImagePullPolicyEnum {
  ALWAYS = 'Always',
  IF_NOT_PRESENT = 'IfNotPresent',
  NEVER = 'never',
}

export interface ClusterSettings {
  connected: boolean;
  version: string;
  server: string;
}

export interface VeleroServerSettings {
  name: string;
  namespace: string;
  version: string;
  connected: boolean;
}

export interface VeleroAgentSettings {
  name: string;
  namespace: string;
  version: string;
  connected: boolean;
  node: string;
  ip: string;
}

export interface VeleroUiSettings {
  version: string;
  mode: string;
}
