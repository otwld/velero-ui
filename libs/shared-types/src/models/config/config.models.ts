export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export interface AppPublicConfig extends AppConfig {
  noAuthRequired: boolean;
  basicAuth: Partial<BasicAuthConfig>;
  google: Partial<GoogleConfig>;
  github: Partial<GithubConfig>;
  gitlab: Partial<GitlabConfig>;
  microsoft: Partial<MicrosoftConfig>;
  oauth: Partial<OauthConfig>;
}

export interface AppConfig {
  environment: Environment;
  grafanaUrl?: string;
  baseUrl: string;
  logLevel: string;
  secret?: string;
  sessionDuration?: string;
  namespace?: string;
  policyPath?: string;
  cacheTTL: number;
}

export interface LDAPConfig {
  enabled: boolean;
  url: string;
  bindDn: string;
  bindCredentials: string;
  searchBase: string;
  searchFilter: string;
  searchAttributes: string;
  groupSearchBase: string;
}

export interface BasicAuthConfig {
  enabled: boolean;
  username: string;
  password: string;
}

export interface GoogleConfig {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  scopes: string;
  redirectUri: string;
}

export interface GithubConfig {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  scopes: string;
  redirectUri: string;
}

export interface MicrosoftConfig {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  scopes: string;
  redirectUri: string;
  tenant: string;
}

export interface GitlabConfig {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  scopes: string;
  redirectUri: string;
  baseUrl: string;
}

export interface OauthConfig {
  enabled: boolean;
  name: string;
  clientId: string;
  clientSecret: string;
  scopes: string;
  redirectUri: string;
  tokenUrl: string;
  authorizationUrl: string;
  userInfoUrl: string;
  groupClaim?: string;
}

export interface VeleroConfig {
  namespace: string;
}

export interface K8sConfig {
  configPath: string;
  context: string;
}
