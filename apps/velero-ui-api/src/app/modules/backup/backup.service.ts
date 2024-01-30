import { Inject, Injectable } from '@nestjs/common';
import { K8S_CONNECTION } from '../../shared/modules/k8s/k8s.constants';
import {
  CoreV1Api,
  CustomObjectsApi,
  KubeConfig,
} from '@kubernetes/client-node';
import { concatMap, map, Observable } from 'rxjs';
import { Backup } from '@velero-ui/shared-types';
import { from } from 'rxjs';
import http from 'http';
import { VELERO } from '../../shared/constants/velero.constants';
import {
  VeleroServer,
  VeleroService,
} from '../../shared/modules/velero/velero.service';

@Injectable()
export class BackupService {
  private k8sCustomObjectApi: CustomObjectsApi;
  private k8sCoreV1Api: CoreV1Api;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private readonly veleroService: VeleroService
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
    this.k8sCoreV1Api = this.k8s.makeApiClient(CoreV1Api);
  }

  public find(
    offset: number = 0,
    limit: number = 20,
    search?: string
  ): Observable<any> {
    return from(
      this.k8sCustomObjectApi.listClusterCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        VELERO.PLURAL_BACKUPS
      )
    )
      .pipe(map((r: { response: http.IncomingMessage; body: any }) => r.body))
      .pipe(
        map((r) => ({
          ...r,
          total: r.items.length,
          items: (r.items = r.items
            .filter((i: Backup) => i.metadata.name.includes(search))
            .slice(offset, offset + limit)),
        }))
      );
  }

  public findByName(name: string, namespace: string): Observable<Backup> {
    return from(
      this.k8sCustomObjectApi.getNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        namespace,
        VELERO.PLURAL_BACKUPS,
        name
      )
    ).pipe(map((r: { response: http.IncomingMessage; body: any }) => r.body));
  }

  public logs(name: string) {
    return this.veleroService
      .checkServer()
      .pipe(
        concatMap((velero: VeleroServer) =>
          this.k8sCoreV1Api.readNamespacedPodLog(
            velero.podName,
            velero.namespace
          )
        )
      )
      .pipe(
        map(
          (r: { response: http.IncomingMessage; body: any }): string => r.body
        )
      )
      .pipe(map((raw) => raw.split('\n')))
      .pipe(
        map((lines) =>
          lines.filter((line: string) => line.includes(`backup=${name}`))
        )
      );
  }

  public test() {
    return this.veleroService.getServerStatus();
  }

  public delete(names: string[]) {
    return from(names).pipe(
      concatMap((name: string) =>
        this.k8sCustomObjectApi.deleteClusterCustomObject(
          VELERO.GROUP,
          VELERO.VERSION,
          VELERO.PLURAL_BACKUPS,
          name
        )
      )
    );
  }
}
