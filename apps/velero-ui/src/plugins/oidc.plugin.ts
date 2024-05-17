import type { App } from 'vue';
import { UserManager } from 'oidc-client-ts';

export const registerOidcClient = (app: App): void => {
  const { oidc, baseUrl } = app.config.globalProperties;

  if (oidc?.enabled) {
    const oidcClient: UserManager = new UserManager({
      authority: oidc.authority,
      client_id: oidc.clientId,
      redirect_uri: `${baseUrl || window.location.origin}/login`,
      post_logout_redirect_uri: `${baseUrl || window.location.origin}/login?state=success&reason=logout`,
      response_type: 'code',
      scope: oidc?.scopes || 'openid profile email',
      filterProtocolClaims: true,
      disablePKCE: false
    });

    app.config.globalProperties.oidcClient = oidcClient;
    app.provide('oidcClient', oidcClient);
  }
};
