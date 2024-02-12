import { Inject, Injectable } from '@nestjs/common';
import { K8S_CONNECTION } from '../../shared/modules/k8s/k8s.constants';
import { CustomObjectsApi, KubeConfig } from '@kubernetes/client-node';
import { from, map, Observable } from 'rxjs';
import {
  Ressources,
  V1VolumeSnapshotLocation,
  V1VolumeSnapshotLocationList,
} from '@velero-ui/velero';
import { VELERO } from '../../shared/modules/velero/velero.constants';
import http from 'http';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SnapshotLocationService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private configService: ConfigService
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }
}
