import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { MicrosoftConfig } from '@velero-ui/shared-types';

export default registerAs('microsoft', (): MicrosoftConfig => {
  return {
    enabled: process.env.MICROSOFT_AUTH_ENABLED === 'true' || false,
    clientId: process.env.MICROSOFT_CLIENT_ID || '',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
    scopes: process.env.MICROSOFT_OAUTH_SCOPE || 'user.read',
    redirectUri: process.env.MICROSOFT_REDIRECT_URI || '',
    tenant: process.env.MICROSOFT_TENANT || 'common',
  };
});
