import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { AppConfig, Environment } from '@velero-ui/shared-types';

export default registerAs('app', (): AppConfig => {
  const secret = process.env.AUTH_SECRET_PASSPHRASE;
  if (!secret || Buffer.byteLength(secret.trim(), 'utf8') < 32) {
    throw new Error(
      'AUTH_SECRET_PASSPHRASE must contain at least 32 bytes; generate a random secret with openssl rand -hex 32'
    );
  }

  return {
    environment: <Environment>process.env.NODE_ENV,
    grafanaUrl: process.env.GRAFANA_URL,
    baseUrl: process.env.BASE_URL || '',
    logLevel: process.env.LOG_LEVEL || 'info',
    secret,
    sessionDuration: process.env.AUTH_SESSION_DURATION || '1h',
    namespace: process.env.VELERO_UI_NAMESPACE || 'velero-ui',
    policyPath: process.env.POLICY_FILE_PATH,
    cacheTTL: parseInt(process.env.CACHE_TTL, 10) || 60000,
    language: process.env.DEFAULT_LANGUAGE || 'en',
    timezone: process.env.DEFAULT_TIMEZONE || 'Europe/London',
    timeFormat24h: process.env.DEFAULT_TIME_FORMAT_24H === 'true' || false,
  };
});
