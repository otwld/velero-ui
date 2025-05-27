import { Inject, Injectable } from '@nestjs/common';
import {
  catchError,
  concatMap,
  from,
  lastValueFrom,
  map,
  mergeMap,
  Observable,
  of,
} from 'rxjs';
import {
  ClusterSettings,
  LogType,
  VeleroAgentSettings,
  VeleroLog,
  VeleroServerSettings,
  VeleroUiSettings,
} from '@velero-ui/shared-types';
import {
  CoreV1Api,
  KubeConfig,
  Log,
  V1Container,
  V1Node,
  V1NodeList,
  V1Pod,
} from '@kubernetes/client-node';
import { version } from '../../../../../../package.json';
import { AddVeleroPluginDTO } from '@velero-ui-api/shared/dto/settings.dto';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { Writable } from 'stream';
import { VELERO } from '@velero-ui-api/shared/modules/velero/velero.constants';
import { K8S_CONNECTION } from '@velero-ui-api/shared/utils/k8s.utils';
import { VeleroService } from '@velero-ui-api/shared/modules/velero/velero.service';
import { ServerStatusRequestService } from '@velero-ui-api/modules/server-status-request/server-status-request.service';
import { V1PluginInfo, V1ServerStatusRequest } from '@velero-ui/velero';
import { AppLogger } from "@velero-ui-api/shared/modules/logger/logger.service";
import {
  parseVeleroLog,
  parseVeleroUILog,
} from '@velero-ui-api/shared/utils/logs.utils';

@Injectable()
export class SettingsService {
  private k8sCoreV1Api: CoreV1Api;
  private activeServerLogStreams: Map<string, Writable> = new Map<
    string,
    Writable
  >();
  private k8sLog: Log;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private logger: AppLogger,
    private readonly serverStatusRequestService: ServerStatusRequestService,
    private readonly veleroService: VeleroService,
    private configService: ConfigService
  ) {
    this.k8sCoreV1Api = this.k8s.makeApiClient(CoreV1Api);
    this.k8sLog = new Log(k8s);
  }

  public getCluster(): Observable<ClusterSettings> {
    return from(this.k8sCoreV1Api.listNode())
      .pipe(map((r: V1NodeList) => r.items))
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
            connected: pod.status?.phase === 'Running',
            name: pod.metadata?.name || 'unknown',
            namespace: pod.metadata?.namespace || 'unknown',
            version: pod.spec?.containers
              ?.find((container: V1Container) =>
                container.image?.startsWith(VELERO.IMAGE)
              )
              ?.image?.split(':')[1] || 'unknown',
          })
        ),
        catchError(
          (err): Observable<VeleroServerSettings> => {
            this.logger.error(err, SettingsService.name)
            return of({
              connected: false,
              name: 'unknown',
              namespace: 'unknown',
              version: 'unknown',
            })
          }
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
              name: pod.metadata?.name || 'unknown',
              namespace: pod.metadata?.namespace || 'unknown',
              connected: pod.status?.phase === 'Running',
              version: pod.spec?.containers
                ?.find((container: V1Container) =>
                  container.image?.startsWith(VELERO.IMAGE)
                )
                ?.image?.split(':')[1] || 'unknown',
              node: pod.spec?.nodeName || 'unknown',
              ip: pod.status?.podIP || 'unknown',
            })
          )
        ),
        catchError((err): Observable<VeleroAgentSettings[]> => {
          this.logger.error(err, SettingsService.name)
          return of([]);
        })
      );
  }

  public getVeleroUi(): Observable<VeleroUiSettings> {
    if (this.configService.get('k8s.configPath')) {
      return of({
        version: version,
        mode: 'Standalone',
      });
    } else {
      return this.veleroService
        .checkVeleroUI()
        .pipe(concatMap(() => this.veleroService.getVeleroUI()))
        .pipe(
          map(
            (pod: V1Pod): VeleroUiSettings => ({
              version: version,
              mode: 'In Cluster',
              name: pod.metadata.name,
            })
          ),
          catchError(
            (): Observable<VeleroUiSettings> =>
              of({
                version: version,
                mode: 'Standalone',
              })
          )
        );
    }
  }

  public getPlugins(): Observable<V1PluginInfo[]> {
    return this.serverStatusRequestService
      .create()
      .pipe(map((request: V1ServerStatusRequest) => request?.status?.plugins));
  }

  public async openLogsStream(
    client: Socket,
    type: string,
    nodeName?: string
    type: LogType,
    nodeName?: string
  ): Promise<void> {
    let name: string;
    let containerName: string;
    let namespace: string;

    if (type === LogType.VeleroServer) {
      const veleroServer: VeleroServerSettings = await lastValueFrom(
        this.getVeleroServer()
      );
      name = veleroServer.name;
      containerName = 'velero';
      namespace = this.configService.get('velero.namespace');
    } else if (type === LogType.VeleroUI) {
      const veleroUI: VeleroUiSettings = await lastValueFrom(
        this.getVeleroUi()
      );
      name = veleroUI.name;
      containerName = 'velero-ui';
      namespace = this.configService.get('app.namespace');
    } else {
      name = nodeName;
      containerName = 'node-agent';
      namespace = this.configService.get('velero.namespace');
    }

    if (this.activeServerLogStreams.has(client.id)) {
      return;
    }

    const stream: Writable = new Writable({
      write: (chunk, encoding: BufferEncoding, callback) => {
        client.emit(
          'settings:logs',
          chunk
            .toString()
            .split('\n')
            .map((line: string) =>
              type === LogType.VeleroUI
                ? parseVeleroUILog(line)
                : parseVeleroLog(line)
            )
            .filter((log: VeleroLog) => !!log)
        );
        callback();
      },
    });

    this.activeServerLogStreams.set(client.id, stream);

    try {
      await this.k8sLog.log(namespace, name, containerName, stream, {
        follow: true,
        tailLines: 25,
      });
    } catch (error) {
      console.error('Error streaming logs:', error);
      this.activeServerLogStreams.delete(client.id);
      stream.end();
    }
  }

  public closeLogsSteam(client: Socket): void {
    for (const [key, stream] of this.activeServerLogStreams) {
      if (key === client.id) {
        stream.end();
        this.activeServerLogStreams.delete(key);
      }
    }
  }

  public addVeleroPlugin(data: AddVeleroPluginDTO) {
    return '';
  }
}
