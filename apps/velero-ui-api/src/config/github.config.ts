import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { GithubConfig } from '@velero-ui/shared-types';

export default registerAs('github', (): GithubConfig => {
  return {
    enabled: process.env.GITHUB_AUTH_ENABLED === 'true' || false,
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    scopes: process.env.GITHUB_OAUTH_SCOPE || 'openid email profile',
    redirectUri: process.env.GITHUB_REDIRECT_URI || '',
  };
});
