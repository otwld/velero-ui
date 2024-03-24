export interface AppPublicConfig extends AppConfig {
  oidc: Partial<OIDCConfig>;
  basicAuth: Partial<BasicAuthConfig>;
}

export interface AppConfig {
  grafanaUrl?: string;
  baseUrl: string;
}

export interface OIDCConfig {
  enabled: boolean;
  clientId: string;
  jwksUri: string;
  authority: string;
  clientSecret: string;
  scopes: string;
}

export interface LDAPConfig {
  enabled: boolean;
  url: string;
  bindDn: string;
  bindCredentials: string;
  searchBase: string;
  searchFilter: string;
  searchAttributes: string;
}

export interface BasicAuthConfig {
  enabled: boolean;
  username: string;
  password: string;
  secret: string;
}

export interface VeleroConfig {
  namespace: string;
}

export interface K8sConfig {
  kubeConfigPath: string;
}
