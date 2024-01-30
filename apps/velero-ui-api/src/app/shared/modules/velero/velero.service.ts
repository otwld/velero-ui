import { Inject, Injectable } from '@nestjs/common';
import { K8S_CONNECTION } from '../k8s/k8s.constants';
import {
  CoreV1Api,
  KubeConfig,
  V1Pod,
  V1PodStatus,
} from '@kubernetes/client-node';
import { catchError, from, map, Observable, tap } from 'rxjs';
import http from 'http';
import { VELERO } from '../../constants/velero.constants';
import { V1PodList } from '@kubernetes/client-node/dist/gen/model/v1PodList';

export interface VeleroServer {
  namespace: string;
  podName: string;
}

@Injectable()
export class VeleroService {
  private k8sCoreV1Api: CoreV1Api;
  private server: VeleroServer;

  constructor(@Inject(K8S_CONNECTION) private readonly k8s: KubeConfig) {
    this.k8sCoreV1Api = this.k8s.makeApiClient(CoreV1Api);

    this.server = {
      namespace: '',
      podName: '',
    };

    this.findServer().subscribe();
  }

  public checkServer(): Observable<VeleroServer> {
    return this.getServerStatus()
      .pipe(catchError(() => this.findServer()))
      .pipe(
        map(
          (): VeleroServer => ({
            podName: this.server.podName,
            namespace: this.server.namespace,
          })
        )
      );
  }

  public getServerStatus(): Observable<V1PodStatus> {
    return from(
      this.k8sCoreV1Api.readNamespacedPodStatus(
        this.server.podName,
        this.server.namespace
      )
    ).pipe(
      map((r: { response: http.IncomingMessage; body: V1Pod }) => r.body.status)
    );
  }

  public getServer(): Observable<V1Pod> {
    return from(
      this.k8sCoreV1Api.readNamespacedPod(
        this.server.podName,
        this.server.namespace
      )
    ).pipe(map((r: { response: http.IncomingMessage; body: V1Pod }) => r.body));
  }

  public getAgents(): Observable<V1Pod[]> {
    return from(this.k8sCoreV1Api.listNamespacedPod(this.server.namespace))
      .pipe(
        map(
          (r: { response: http.IncomingMessage; body: V1PodList }) =>
            r.body.items
        )
      )
      .pipe(
        map((pods: V1Pod[]) =>
          pods.filter(
            (pod: V1Pod) =>
              pod.metadata.name.startsWith('restic') ||
              pod.metadata.name.startsWith('node-agent')
          )
        )
      );
  }

  private findServer(): Observable<V1Pod> {
    return from(this.k8sCoreV1Api.listPodForAllNamespaces())
      .pipe(
        map(
          (r: { response: http.IncomingMessage; body: V1PodList }) =>
            r.body.items
        )
      )
      .pipe(
        map(
          (pods: V1Pod[]): V1Pod =>
            pods.find((pod: V1Pod) =>
              pod?.metadata?.name.startsWith(VELERO.SERVER_PREFIX)
            )
        )
      )
      .pipe(
        tap((pod: V1Pod): void => {
          if (pod) {
            this.server.namespace = pod.metadata.namespace;
            this.server.podName = pod.metadata.name;
          } else {
            throw new Error('Cannot find Velero server!');
          }
        })
      );
  }
}
