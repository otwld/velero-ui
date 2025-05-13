import { Inject, Injectable } from '@nestjs/common';
import { K8S_CONNECTION } from '@velero-ui-api/shared/utils/k8s.utils';
import { CustomObjectsApi, KubeConfig } from '@kubernetes/client-node';
import {
  Resources,
  V1DownloadRequest,
  V1DownloadRequestPhase,
} from '@velero-ui/velero';
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
import { CreateDownloadRequestDto } from '@velero-ui-api/shared/dto/download-request.dto';
import { VELERO } from '@velero-ui-api/shared/modules/velero/velero.constants';
import { createDownloadRequest } from '@velero-ui-api/modules/download-request/download-request.utils';

@Injectable()
export class DownloadRequestService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private configService: ConfigService,
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }

  public create(body: CreateDownloadRequestDto): Observable<V1DownloadRequest> {
    return of(
      createDownloadRequest(
        body.name,
        this.configService.get('velero.namespace'),
        body.kind,
      ),
    )
      .pipe(
        concatMap((request: V1DownloadRequest) =>
          this.k8sCustomObjectApi.createNamespacedCustomObject({
            group: VELERO.GROUP,
            version: VELERO.VERSION,
            namespace: this.configService.get('velero.namespace'),
            plural: Resources.DOWNLOAD_REQUEST.plural,
            body: request,
          }),
        ),
      )
      .pipe(
        concatMap((request: V1DownloadRequest) =>
          this.waitAndGetDownloadRequest(request),
        ),
      );
  }

  private waitAndGetDownloadRequest(
    request: V1DownloadRequest,
  ): Observable<V1DownloadRequest> {
    return defer(() =>
      from(
        this.k8sCustomObjectApi.getNamespacedCustomObject({
          group: VELERO.GROUP,
          version: VELERO.VERSION,
          namespace: this.configService.get('velero.namespace'),
          plural: Resources.DOWNLOAD_REQUEST.plural,
          name: request.metadata.name,
        }),
      ),
    ).pipe(
      map((requestStatus: V1DownloadRequest): V1DownloadRequest => {
        if (requestStatus?.status?.phase !== V1DownloadRequestPhase.Processed) {
          throw new Error('Download request is not ready!');
        }
        return requestStatus;
      }),
      retry({
        count: 5,
        delay: 4000,
      }),
      catchError(() => {
        return throwError(
          () => new Error('Download request is not ready after 5 retries!'),
        );
      }),
    );
  }
}
