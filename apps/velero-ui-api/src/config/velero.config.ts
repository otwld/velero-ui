import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { VeleroConfig } from '@velero-ui/shared-types';

export default registerAs('velero', (): VeleroConfig => {
  return {
    namespace: process.env.VELERO_NAMESPACE || 'velero',
  };
});
