import { registerAs } from '@nestjs/config';
import * as process from 'process';
import {AppConfig, Environment} from '@velero-ui/shared-types';

export default registerAs('app', (): AppConfig => {
  return {
    environment: <Environment>process.env.NODE_ENV,
    grafanaUrl: process.env.GRAFANA_URL,
    baseUrl: process.env.BASE_URL || '',
    logLevel: process.env.LOG_LEVEL || 'info',
    secret: process.env.AUTH_SECRET_PASSPHRASE || 'this is the secret pass phrase',
    sessionDuration: process.env.AUTH_SESSION_DURATION || '1h',
  };
});
