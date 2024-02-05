import { Inject, Injectable } from '@nestjs/common';
import { K8S_CONNECTION } from '../../shared/modules/k8s/k8s.constants';
import {
  CoreV1Api,
  CustomObjectsApi,
  KubeConfig,
} from '@kubernetes/client-node';
import {catchError, concatMap, map, Observable, tap} from 'rxjs';
import { from } from 'rxjs';
import http from 'http';
import { VELERO } from '../../shared/modules/velero/velero.constants';
import { VeleroService } from '../../shared/modules/velero/velero.service';
import {
  V1BackupList,
  V1Backup,
  V1DownloadTargetKind,
  V1DownloadRequest,
  Ressources,
} from '@velero-ui/velero';
import { ConfigService } from '@nestjs/config';
import { DownloadRequestService } from '../../shared/modules/download-request/download-request.service';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { unzipSync } from 'zlib';

@Injectable()
export class BackupService {
  private k8sCustomObjectApi: CustomObjectsApi;
  private k8sCoreV1Api: CoreV1Api;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private readonly veleroService: VeleroService,
    private configService: ConfigService,
    private readonly downloadRequestService: DownloadRequestService,
    private readonly httpService: HttpService
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
    this.k8sCoreV1Api = this.k8s.makeApiClient(CoreV1Api);
  }

  public find(
    offset: number = 0,
    limit: number = 20,
    search?: string
  ): Observable<V1BackupList> {
    return from(
      this.k8sCustomObjectApi.listNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        Ressources.BACKUP.plurial
      )
    )
      .pipe(
        map(
          (r: { response: http.IncomingMessage; body: V1BackupList }): V1BackupList =>
            r.body
        )
      )
      .pipe(
        map((r: V1BackupList) => ({
          ...r,
          total: r.items.length,
          items: (r.items = r.items
            .filter((i: V1Backup) => i.metadata.name.includes(search))
            .slice(offset, offset + limit)),
        }))
      );
  }

  public findByName(name: string): Observable<V1Backup> {
    return from(
      this.k8sCustomObjectApi.getNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        Ressources.BACKUP.plurial,
        name
      )
    ).pipe(
      map((r: { response: http.IncomingMessage; body: V1Backup }) => r.body)
    );
  }

  public logs(name: string): Observable<string[]> {
    return from(
      this.downloadRequestService.create({
        name,
        kind: V1DownloadTargetKind.BackupLog,
      })
    )
      .pipe(
        concatMap(
          (
            downloadRequest: V1DownloadRequest
          ): Observable<AxiosResponse<ArrayBuffer>> =>
            this.httpService.get(downloadRequest?.status?.downloadURL, {
              responseType: 'arraybuffer',
            })
        )
      )
      .pipe(map((response: AxiosResponse<ArrayBuffer>) => response.data))
      .pipe(map((buffer: ArrayBuffer) => unzipSync(buffer)))
      .pipe(map((content: Buffer) => content.toString().split('\n')));
  }
}
