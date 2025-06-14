import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { MicrosoftConfig } from '@velero-ui/shared-types';

export default registerAs('microsoft', (): MicrosoftConfig => {
  let authorizationUrl =
    'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
  let tokenUrl =
    'https://login.microsoftonline.com/common/oauth2/v2.0/token';
  const tenant = process.env.MICROSOFT_TENANT || 'common';

  if (
    !process.env.MICROSOFT_AUTHORIZATION_URL &&
    !process.env.MICROSOFT_TOKEN_URL
  ) {
    authorizationUrl = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`;
    tokenUrl = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
  } else {
    authorizationUrl = process.env.MICROSOFT_AUTHORIZATION_URL;
    tokenUrl = process.env.MICROSOFT_TOKEN_URL;
  }

  return {
    enabled: process.env.MICROSOFT_AUTH_ENABLED === 'true' || false,
    clientId: process.env.MICROSOFT_CLIENT_ID || '',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
    scopes: process.env.MICROSOFT_OAUTH_SCOPE || 'user.read',
    redirectUri: process.env.MICROSOFT_REDIRECT_URI || '',
    tenant,
    authorizationUrl,
    tokenUrl,
  };
});
