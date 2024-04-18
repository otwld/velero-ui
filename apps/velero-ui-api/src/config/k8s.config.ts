import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { K8sConfig } from '@velero-ui/shared-types';

export default registerAs('k8s', (): K8sConfig => {
  return {
    configPath: process.env.KUBE_CONFIG_PATH,
    context: process.env.KUBE_CONTEXT,
  };
});
