import { Inject, Injectable } from '@nestjs/common';
import {
  catchError,
  concatMap,
  from,
  map,
  mergeMap,
  Observable,
  of,
} from 'rxjs';
import {
  ClusterSettings,
  VeleroAgentSettings,
  VeleroServerSettings,
  VeleroUiSettings,
} from '@velero-ui/shared-types';
import { K8S_CONNECTION } from '../../shared/modules/k8s/k8s.constants';
import {
  CoreV1Api,
  KubeConfig,
  V1Container,
  V1Node,
  V1Pod,
} from '@kubernetes/client-node';
import { VeleroService } from '../../shared/modules/velero/velero.service';
import { version } from '../../../../../../package.json';
import { VELERO } from '../../shared/constants/velero.constants';
import http from 'http';
import { V1NodeList } from '@kubernetes/client-node/dist/gen/model/v1NodeList';

@Injectable()
export class SettingsService {
  private k8sCoreV1Api: CoreV1Api;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private readonly veleroService: VeleroService
  ) {
    this.k8sCoreV1Api = this.k8s.makeApiClient(CoreV1Api);
  }

  public getCluster(): Observable<ClusterSettings> {
    return from(this.k8sCoreV1Api.listNode())
      .pipe(
        map(
          (r: { response: http.IncomingMessage; body: V1NodeList }) =>
            r.body.items
        )
      )
      .pipe(
        map(
          (nodes: V1Node[]): ClusterSettings => ({
            connected: true,
            server: this.k8s.getCurrentCluster().server,
            version: nodes[0].status.nodeInfo.kubeProxyVersion,
          })
        ),
        catchError(
          (): Observable<ClusterSettings> =>
            of({
              connected: false,
              server: this.k8s.getCurrentCluster().server,
              version: 'unknown',
            })
        )
      );
  }

  public getVeleroServer(): Observable<VeleroServerSettings> {
    return this.veleroService
      .checkServer()
      .pipe(concatMap(() => this.veleroService.getServer()))
      .pipe(
        map(
          (pod: V1Pod): VeleroServerSettings => ({
            connected: pod.status.phase === 'Running',
            name: pod.metadata.name,
            namespace: pod.metadata.namespace,
            version: pod.spec.containers
              .find((container: V1Container) =>
                container.image.startsWith(VELERO.IMAGE)
              )
              .image.split(':')[1],
          })
        ),
        catchError(
          (): Observable<VeleroServerSettings> =>
            of({
              connected: false,
              name: 'unknown',
              namespace: 'unknown',
              version: 'unknown',
            })
        )
      );
  }

  public getVeleroAgents(): Observable<VeleroAgentSettings[]> {
    return this.veleroService
      .checkServer()
      .pipe(mergeMap(() => this.veleroService.getAgents()))
      .pipe(
        map((pods: V1Pod[]) =>
          pods.map(
            (pod: V1Pod): VeleroAgentSettings => ({
              name: pod.metadata.name,
              namespace: pod.metadata.namespace,
              connected: pod.status.phase === 'Running',
              version: pod.spec.containers
                .find((container: V1Container) =>
                  container.image.startsWith(VELERO.IMAGE)
                )
                .image.split(':')[1],
              node: pod.spec.nodeName,
              ip: pod.status.podIP,
            })
          )
        ),
        catchError((): Observable<VeleroAgentSettings[]> => of([]))
      );
  }

  public getVeleroUi(): Observable<VeleroUiSettings> {
    return of({
      connected: true,
      version: version,
      mode: this.k8s.getCurrentUser().token ? 'In cluster' : 'Standalone',
    });
  }
}
