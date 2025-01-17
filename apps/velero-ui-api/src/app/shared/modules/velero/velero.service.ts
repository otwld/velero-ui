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
import { VELERO } from './velero.constants';
import { V1PodList } from '@kubernetes/client-node/dist/gen/model/v1PodList';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VeleroService {
  private k8sCoreV1Api: CoreV1Api;
  private podServerName: string;
  private podVeleroUIName: string;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private configService: ConfigService
  ) {
    this.k8sCoreV1Api = this.k8s.makeApiClient(CoreV1Api);

    this.findServer().subscribe();
  }

  public checkServer(): Observable<string> {
    return this.getServerStatus()
      .pipe(catchError(() => this.findServer()))
      .pipe(map(() => this.podServerName));
  }

  public checkVeleroUI(): Observable<string> {
    return this.getVeleroUIStatus()
      .pipe(catchError(() => this.findVeleroUI()))
      .pipe(map(() => this.podServerName));
  }

  public getServerStatus(): Observable<V1PodStatus> {
    return from(
      this.k8sCoreV1Api.readNamespacedPodStatus(
        this.podServerName,
        this.configService.get('velero.namespace')
      )
    ).pipe(
      map((r: { response: http.IncomingMessage; body: V1Pod }) => r.body.status)
    );
  }

  public getVeleroUIStatus(): Observable<V1PodStatus> {
    return from(
      this.k8sCoreV1Api.readNamespacedPodStatus(
        this.podVeleroUIName,
        this.configService.get('app.namespace')
      )
    ).pipe(
      map((r: { response: http.IncomingMessage; body: V1Pod }) => r.body.status)
    );
  }

  public getVeleroUI(): Observable<V1Pod> {
    return from(
      this.k8sCoreV1Api.readNamespacedPod(
        this.podServerName,
        this.configService.get('velero.namespace')
      )
    ).pipe(map((r: { response: http.IncomingMessage; body: V1Pod }) => r.body));
  }

  public getServer(): Observable<V1Pod> {
    return from(
      this.k8sCoreV1Api.readNamespacedPod(
        this.podServerName,
        this.configService.get('velero.namespace')
      )
    ).pipe(map((r: { response: http.IncomingMessage; body: V1Pod }) => r.body));
  }

  public getAgents(): Observable<V1Pod[]> {
    return from(
      this.k8sCoreV1Api.listNamespacedPod(
        this.configService.get('velero.namespace')
      )
    )
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
    return from(
      this.k8sCoreV1Api.listNamespacedPod(
        this.configService.get('velero.namespace')
      )
    )
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
            this.podServerName = pod.metadata.name;
          } else {
            throw new Error('Cannot find Velero server!');
          }
        })
      );
  }

  private findVeleroUI(): Observable<V1Pod> {
    return from(
      this.k8sCoreV1Api.listNamespacedPod(
        this.configService.get('app.namespace')
      )
    )
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
              pod?.metadata?.name.startsWith(VELERO.UI_PREFIX)
            )
        )
      )
      .pipe(
        tap((pod: V1Pod): void => {
          if (pod) {
            this.podVeleroUIName = pod.metadata.name;
          } else {
            throw new Error('Cannot find Velero UI!');
          }
        })
      );
  }
}
