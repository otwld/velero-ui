import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { GitlabConfig } from '@velero-ui/shared-types';

export default registerAs('gitlab', (): GitlabConfig => {
  return {
    enabled: process.env.GITLAB_AUTH_ENABLED === 'true' || false,
    clientId: process.env.GITLAB_CLIENT_ID || '',
    clientSecret: process.env.GITLAB_CLIENT_SECRET || '',
    scopes: process.env.GITLAB_OAUTH_SCOPE || 'read_user',
    redirectUri: process.env.GITLAB_REDIRECT_URI || '',
    baseUrl: process.env.GITLAB_BASE_URL || 'https://gitlab.com/',
  };
});
