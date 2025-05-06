import { Inject, Injectable } from '@nestjs/common';
import { K8S_CONNECTION } from '@velero-ui-api/shared/utils/k8s.utils';
import { CustomObjectsApi, KubeConfig } from '@kubernetes/client-node';
import { ConfigService } from '@nestjs/config';
import {
  catchError,
  concatMap,
  defer,
  from,
  map,
  Observable,
  of,
  retry,
  throwError,
} from 'rxjs';
import {
  Resources,
  V1ServerStatusRequest,
  V1ServerStatusRequestPhase,
} from '@velero-ui/velero';
import { VELERO } from '@velero-ui-api/shared/modules/velero/velero.constants';
import { createServerStatusRequest } from 'apps/velero-ui-api/src/app/modules/server-status-request/server-status-request.utils';

@Injectable()
export class ServerStatusRequestService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private configService: ConfigService,
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }

  public create(): Observable<V1ServerStatusRequest> {
    return of(
      createServerStatusRequest(this.configService.get('velero.namespace')),
    )
      .pipe(
        concatMap((request: V1ServerStatusRequest) =>
          this.k8sCustomObjectApi.createNamespacedCustomObject({
            group: VELERO.GROUP,
            version: VELERO.VERSION,
            namespace: this.configService.get('velero.namespace'),
            plural: Resources.SERVER_STATUS_REQUEST.plural,
            body: request,
          }),
        ),
      )
      .pipe(
        concatMap((request: V1ServerStatusRequest) =>
          this.waitAndGetServerStatusRequest(request),
        ),
      );
  }

  private waitAndGetServerStatusRequest(
    request: V1ServerStatusRequest,
  ): Observable<V1ServerStatusRequest> {
    return defer(() =>
      from(
        this.k8sCustomObjectApi.getNamespacedCustomObject({
          group: VELERO.GROUP,
          version: VELERO.VERSION,
          namespace: this.configService.get('velero.namespace'),
          plural: Resources.SERVER_STATUS_REQUEST.plural,
          name: request.metadata.name,
        }),
      ),
    ).pipe(
      map((requestStatus: V1ServerStatusRequest): V1ServerStatusRequest => {
        if (
          requestStatus?.status?.phase !== V1ServerStatusRequestPhase.Processed
        ) {
          throw new Error('Server status request is not ready!');
        }
        return requestStatus;
      }),
      retry({
        count: 5,
        delay: 4000,
      }),
      catchError(() => {
        return throwError(
          () =>
            new Error('Server status request is not ready after 5 retries!'),
        );
      }),
    );
  }
}
