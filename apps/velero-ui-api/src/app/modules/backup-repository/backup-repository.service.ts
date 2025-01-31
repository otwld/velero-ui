import { Inject, Injectable } from '@nestjs/common';
import { K8S_CONNECTION } from '@velero-ui-api/shared/utils/k8s.utils';
import { CustomObjectsApi, KubeConfig } from '@kubernetes/client-node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BackupRepositoryService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private configService: ConfigService
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }
}
