import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { GoogleConfig } from '@velero-ui/shared-types';

export default registerAs('google', (): GoogleConfig => {
  return {
    enabled: process.env.GOOGLE_AUTH_ENABLED === 'true' || false,
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    scopes: process.env.GOOGLE_OAUTH_SCOPE || 'openid email profile',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || '',
  };
});
