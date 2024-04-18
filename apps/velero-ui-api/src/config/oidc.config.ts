import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { OIDCConfig } from '@velero-ui/shared-types';

export default registerAs('oidc', (): OIDCConfig => {
  return {
    enabled: process.env.OIDC_ENABLED === 'true' || false,
    authority: process.env.OIDC_AUTHORITY || '',
    jwksUri: process.env.OIDC_JWKS_URI || '',
    clientId: process.env.OIDC_CLIENT_ID || '',
    clientSecret: process.env.OIDC_CLIENT_SECRET || '',
    scopes: process.env.OIDC_SCOPES || '',
  };
});
