import { registerAs } from '@nestjs/config';
import * as process from 'process';
import {MicrosoftConfig, OauthConfig} from '@velero-ui/shared-types';

export default registerAs('oauth', (): OauthConfig => {
  return {
    enabled: process.env.OAUTH_AUTH_ENABLED === 'true' || false,
    clientId: process.env.OAUTH_CLIENT_ID || '',
    clientSecret: process.env.OAUTH_CLIENT_SECRET || '',
    scopes: process.env.OAUTH_OAUTH_SCOPE || 'openid profile email',
    redirectUri: process.env.OAUTH_REDIRECT_URI || '',
    tokenUrl: process.env.OAUTH_TOKEN_URL || '',
    authorizationUrl: process.env.OAUTH_AUTHORIZATION_URL || '',
    userInfoUrl: process.env.OAUTH_USER_INFO_URL || '',
    name: process.env.OAUTH_NAME || 'SSO',
  };
});
