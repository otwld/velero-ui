import { ModuleMetadata } from '@nestjs/common';
import { ConfigOptions } from '@kubernetes/client-node/dist/config_types';

export interface K8sModuleFactoryOptions {
  file: string;
  opts?: Partial<ConfigOptions>;
}

export interface K8sModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<K8sModuleFactoryOptions> | K8sModuleFactoryOptions;
  inject?: any[];
}
