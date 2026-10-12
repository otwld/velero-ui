import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { BasicAuthConfig } from '@velero-ui/shared-types';

export default registerAs('basicAuth', (): BasicAuthConfig => {
  const enabled = process.env.BASIC_AUTH_ENABLED === 'true';
  const username = process.env.BASIC_AUTH_USERNAME;
  const password = process.env.BASIC_AUTH_PASSWORD;
  if (
    enabled &&
    (!username?.trim() || !password?.trim() || password === 'admin')
  ) {
    throw new Error(
      'Set BASIC_AUTH_USERNAME and a non-default BASIC_AUTH_PASSWORD, or disable BASIC_AUTH_ENABLED'
    );
  }

  return {
    enabled,
    username,
    password,
  };
});
