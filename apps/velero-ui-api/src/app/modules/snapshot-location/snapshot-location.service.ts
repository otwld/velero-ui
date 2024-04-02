import { Inject, Injectable } from '@nestjs/common';
import { K8S_CONNECTION } from '../../shared/modules/k8s/k8s.constants';
import { CustomObjectsApi, KubeConfig } from '@kubernetes/client-node';

@Injectable()
export class SnapshotLocationService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }
}
