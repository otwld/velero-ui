import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { TauriConfig } from '@velero-ui/shared-types';

export default registerAs('tauri', (): TauriConfig => {
  return {
    enabled: process.env.TAURI === 'true' || false,
  };
});
