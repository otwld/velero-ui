import { Inject, Injectable } from '@nestjs/common';
import { K8S_CONNECTION } from '@velero-ui-api/shared/modules/k8s/k8s.constants';
import { CustomObjectsApi, KubeConfig } from '@kubernetes/client-node';
import {
  Ressources,
  V1DownloadRequest,
  V1DownloadRequestPhase,
} from '@velero-ui/velero';
import { ConfigService } from '@nestjs/config';
import { concatMap, from, map, Observable, of, retry, throwError} from 'rxjs';
import { CreateDownloadRequestDto } from '@velero-ui-api/shared/dto/download-request.dto';
import http from 'http';
import { VELERO } from '@velero-ui-api/shared/modules/velero/velero.constants';
import { createDownloadRequest } from '@velero-ui-api/modules/download-request/download-request.utils';

@Injectable()
export class DownloadRequestService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private configService: ConfigService
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }

  public create(body: CreateDownloadRequestDto): Observable<V1DownloadRequest> {
    return of(
      createDownloadRequest(
        body.name,
        this.configService.get('velero.namespace'),
        body.kind
      )
    )
      .pipe(
        concatMap((request: V1DownloadRequest) =>
          this.k8sCustomObjectApi.createNamespacedCustomObject(
            VELERO.GROUP,
            VELERO.VERSION,
            this.configService.get('velero.namespace'),
            Ressources.DOWNLOAD_REQUEST.plurial,
            request
          )
        )
      )
      .pipe(
        map(
          (r: { response: http.IncomingMessage; body: V1DownloadRequest }) =>
            r.body
        )
      )
      .pipe(
        concatMap((request: V1DownloadRequest) =>
          this.waitAndGetDownloadRequest(request)
        )
      );
  }

  private waitAndGetDownloadRequest(
    request: V1DownloadRequest
  ): Observable<V1DownloadRequest> {
    return from(
      this.k8sCustomObjectApi.getNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        Ressources.DOWNLOAD_REQUEST.plurial,
        request.metadata.name
      )
    )
      .pipe(
        map(
          (r: { response: http.IncomingMessage; body: V1DownloadRequest }) =>
            r.body
        )
      )
      .pipe(
        map((requestStatus: V1DownloadRequest): V1DownloadRequest => {
          if (
            requestStatus?.status?.phase !== V1DownloadRequestPhase.Processed
          ) {
            throwError(() => 'Download request not ready!');
          }
          return requestStatus;
        }),
        retry({
          count: 5,
          delay: 1000,
        })
      );
  }
}
