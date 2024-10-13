import { Inject, Injectable } from '@nestjs/common';
import { K8S_CONNECTION } from '@velero-ui-api/shared/modules/k8s/k8s.constants';
import { CustomObjectsApi, KubeConfig } from '@kubernetes/client-node';
import { ConfigService } from '@nestjs/config';
import { concatMap, from, map, Observable, of, retry, throwError } from 'rxjs';
import {
  Resources,
  V1ServerStatusRequest,
  V1ServerStatusRequestPhase,
} from '@velero-ui/velero';
import { VELERO } from '@velero-ui-api/shared/modules/velero/velero.constants';
import http from 'http';
import { createServerStatusRequest } from 'apps/velero-ui-api/src/app/modules/server-status-request/server-status-request.utils';

@Injectable()
export class ServerStatusRequestService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private configService: ConfigService
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }

  public create(): Observable<V1ServerStatusRequest> {
    return of(
      createServerStatusRequest(this.configService.get('velero.namespace'))
    )
      .pipe(
        concatMap((request: V1ServerStatusRequest) =>
          this.k8sCustomObjectApi.createNamespacedCustomObject(
            VELERO.GROUP,
            VELERO.VERSION,
            this.configService.get('velero.namespace'),
            Resources.SERVER_STATUS_REQUEST.plurial,
            request
          )
        )
      )
      .pipe(
        map(
          (r: {
            response: http.IncomingMessage;
            body: V1ServerStatusRequest;
          }) => r.body
        )
      )
      .pipe(
        concatMap((request: V1ServerStatusRequest) =>
          this.waitAndGetServerStatusRequest(request)
        )
      );
  }

  private waitAndGetServerStatusRequest(
    request: V1ServerStatusRequest
  ): Observable<V1ServerStatusRequest> {
    return from(
      this.k8sCustomObjectApi.getNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        Resources.SERVER_STATUS_REQUEST.plurial,
        request.metadata.name
      )
    )
      .pipe(
        map(
          (r: {
            response: http.IncomingMessage;
            body: V1ServerStatusRequest;
          }) => r.body
        )
      )
      .pipe(
        map((requestStatus: V1ServerStatusRequest): V1ServerStatusRequest => {
          if (
            requestStatus?.status?.phase !== V1ServerStatusRequestPhase.Processed
          ) {
            throwError(() => 'Server status request not ready!');
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
