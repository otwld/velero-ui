import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { AppConfig } from '@velero-ui/shared-types';

export default registerAs('app', (): AppConfig => {
  return {
    grafanaUrl: process.env.GRAFANA_URL,
    baseUrl: process.env.BASE_URL || '',
    secret: process.env.AUTH_SECRET_PASSPHRASE || 'this is the secret pass phrase',
    sessionDuration: process.env.AUTH_SESSION_DURATION || '1h',
  };
});
