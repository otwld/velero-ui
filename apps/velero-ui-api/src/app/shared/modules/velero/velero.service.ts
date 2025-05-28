import { Inject, Injectable } from '@nestjs/common';
import {
  CoreV1Api,
  KubeConfig,
  V1Container,
  V1Pod,
  V1PodList,
  V1PodStatus,
} from '@kubernetes/client-node';
import { catchError, from, map, Observable, tap } from 'rxjs';
import { VELERO } from './velero.constants';
import { ConfigService } from '@nestjs/config';
import { K8S_CONNECTION } from '@velero-ui-api/shared/utils/k8s.utils';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';

@Injectable()
export class VeleroService {
  private k8sCoreV1Api: CoreV1Api;
  private podServerName: string;
  private podVeleroUIName: string;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private logger: AppLogger,
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
      .pipe(map(() => this.podVeleroUIName));
  }

  public getServerStatus(): Observable<V1PodStatus> {
    return from(
      this.k8sCoreV1Api.readNamespacedPodStatus({
        name: this.podServerName,
        namespace: this.configService.get('velero.namespace'),
      })
    ).pipe(map((r: V1Pod) => r.status));
  }

  public getVeleroUIStatus(): Observable<V1PodStatus> {
    return from(
      this.k8sCoreV1Api.readNamespacedPodStatus({
        name: this.podVeleroUIName,
        namespace: this.configService.get('app.namespace'),
      })
    ).pipe(map((r: V1Pod) => r.status));
  }

  public getVeleroUI(): Observable<V1Pod> {
    return from(
      this.k8sCoreV1Api.readNamespacedPod({
        name: this.podVeleroUIName,
        namespace: this.configService.get('app.namespace'),
      })
    );
  }

  public getServer(): Observable<V1Pod> {
    return from(
      this.k8sCoreV1Api.readNamespacedPod({
        name: this.podServerName,
        namespace: this.configService.get('velero.namespace'),
      })
    );
  }

  public getAgents(): Observable<V1Pod[]> {
    this.logger.debug(`Finding Velero agent pods...`, VeleroService.name);
    return from(
      this.k8sCoreV1Api.listNamespacedPod({
        namespace: this.configService.get('velero.namespace'),
      })
    )
      .pipe(map((r: V1PodList) => r.items))
      .pipe(
        map((pods: V1Pod[]) =>
          pods.filter((pod: V1Pod) =>
            pod.spec?.containers?.find(
              (container: V1Container) =>
                container.name === VELERO.AGENT_CONTAINER_NAME
            )
          )
        ),
        tap((pods: V1Pod[]) =>
          this.logger.debug(
            `Found ${pods.length} Velero agent pods.`,
            VeleroService.name
          )
        )
      );
  }

  private findServer(): Observable<V1Pod> {
    this.logger.debug(`Finding Velero server pod...`, VeleroService.name);
    return from(
      this.k8sCoreV1Api.listNamespacedPod({
        namespace: this.configService.get('velero.namespace'),
      })
    )
      .pipe(map((r: V1PodList) => r.items))
      .pipe(
        map(
          (pods: V1Pod[]): V1Pod =>
            pods.find((pod: V1Pod) =>
              pod.spec?.containers?.find(
                (container: V1Container) =>
                  container.name === VELERO.SERVER_CONTAINER_NAME
              )
            )
        )
      )
      .pipe(
        tap((pod: V1Pod): void => {
          if (pod) {
            this.logger.debug(
              `Found Velero server pod: ${pod.metadata.name}.`,
              VeleroService.name
            );
            this.podServerName = pod.metadata.name;
          } else {
            throw new Error('Cannot find Velero server!');
          }
        })
      );
  }

  private findVeleroUI(): Observable<V1Pod> {
    this.logger.debug(`Finding Velero UI pod...`, VeleroService.name);
    return from(
      this.k8sCoreV1Api.listNamespacedPod({
        namespace: this.configService.get('app.namespace'),
      })
    )
      .pipe(map((r: V1PodList) => r.items))
      .pipe(
        map(
          (pods: V1Pod[]): V1Pod =>
            pods.find((pod: V1Pod) =>
              pod.spec?.containers?.find(
                (container: V1Container) =>
                  container.name === VELERO.UI_CONTAINER_NAME
              )
            )
        )
      )
      .pipe(
        tap((pod: V1Pod): void => {
          if (pod) {
            this.logger.debug(
              `Found Velero UI pod: ${pod.metadata.name}.`,
              VeleroService.name
            );
            this.podVeleroUIName = pod.metadata.name;
          } else {
            throw new Error('Cannot find Velero UI!');
          }
        })
      );
  }
}
