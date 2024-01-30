import type { App } from 'vue';
import { OidcClient, UserManager } from 'oidc-client-ts';

export const registerOidcClient = (app: App) => {
  const oidcClient: UserManager = new UserManager({
    authority: import.meta.env.VITE_OIDC_AUTHORITY,
    client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
    client_secret: import.meta.env.VITE_OIDC_CLIENT_SECRET,
    redirect_uri: import.meta.env.VITE_BASE_URL + '/login',
    post_logout_redirect_uri: import.meta.env.VITE_BASE_URL + '/login',
    response_type: 'code',
    scope: 'openid email profile',
    response_mode: 'fragment',
    filterProtocolClaims: true,
  });

  app.config.globalProperties.oidcClient = oidcClient;
  app.provide('oidcClient', oidcClient);
};
