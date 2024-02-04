import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('k8s', () => {
  return {
    kubeConfigPath: process.env.KUBE_CONFIG_PATH,
  };
});
