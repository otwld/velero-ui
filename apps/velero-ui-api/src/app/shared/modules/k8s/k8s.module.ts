import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { KubeConfig } from '@kubernetes/client-node';
import {
  K8S_CONNECTION,
  K8S_CONNECTION_NAME,
  K8S_MODULE_OPTIONS,
} from './k8s.constants';
import { catchError, defer, lastValueFrom } from 'rxjs';
import {
  K8sModuleAsyncOptions,
  K8sModuleFactoryOptions,
} from './k8s-options.interface';

@Global()
@Module({})
export class K8sModule {

  static forRootAsync(options: K8sModuleAsyncOptions): DynamicModule {
    const k8sConnectionNameProvider = {
      provide: K8S_CONNECTION_NAME,
      useValue: K8S_CONNECTION,
    };

    const connectionProvider = {
      provide: K8S_CONNECTION,
      useFactory: async (
        options: K8sModuleFactoryOptions
      ): Promise<KubeConfig> => {
        const k8sConnectionError = (error) => error;

        return await lastValueFrom(
          defer(async (): Promise<KubeConfig> => {
            const k8sConfig: KubeConfig = new KubeConfig();

            if (!options.configPath) {
              k8sConfig.loadFromCluster();
            } else {
              k8sConfig.loadFromFile(options.configPath, options.opts);
            }
            if (options.context) {
              k8sConfig.setCurrentContext(options.context);
            }
            return k8sConfig;
          }).pipe(
            catchError((error) => {
              throw k8sConnectionError(error);
            })
          )
        );
      },
      inject: [K8S_MODULE_OPTIONS],
    };
    const asyncProviders: Provider[] = this.createAsyncProviders(options);
    return {
      module: K8sModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        connectionProvider,
        k8sConnectionNameProvider,
      ],
      exports: [connectionProvider],
    };
  }

  private static createAsyncProviders(
    options: K8sModuleAsyncOptions
  ): Provider[] {
    if (options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
  }

  private static createAsyncOptionsProvider(
    options: K8sModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: K8S_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
  }
}
