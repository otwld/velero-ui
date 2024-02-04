import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('velero', () => {
  return {
    namespace: process.env.VELERO_NAMESPACE || 'velero',
  };
});
