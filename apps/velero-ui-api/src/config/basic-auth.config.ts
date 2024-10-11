import { registerAs } from '@nestjs/config';
import * as process from 'process';
import {BasicAuthConfig} from "@velero-ui/shared-types";

export default registerAs('basicAuth', (): BasicAuthConfig => {
  return {
    enabled: process.env.BASIC_AUTH_ENABLED === 'true' || false,
    username: process.env.BASIC_AUTH_USERNAME || 'admin',
    password: process.env.BASIC_AUTH_PASSWORD || 'admin',
  };
});
