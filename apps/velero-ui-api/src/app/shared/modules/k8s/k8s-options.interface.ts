import { ModuleMetadata } from '@nestjs/common';
import { ConfigOptions } from '@kubernetes/client-node/dist/config_types';
import { InjectionToken } from '@nestjs/common/interfaces/modules/injection-token.interface';
import { OptionalFactoryDependency } from '@nestjs/common/interfaces/modules/optional-factory-dependency.interface';

export interface K8sModuleFactoryOptions {
  kubeConfigPath: string;
  opts?: Partial<ConfigOptions>;
}

export interface K8sModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: unknown[]
  ) => Promise<K8sModuleFactoryOptions> | K8sModuleFactoryOptions;
  inject?: Array<InjectionToken | OptionalFactoryDependency>;
}
