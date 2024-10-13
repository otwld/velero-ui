import { Inject, Injectable } from '@nestjs/common';
import { CustomObjectsApi, KubeConfig } from '@kubernetes/client-node';
import { K8S_CONNECTION } from '@velero-ui-api/shared/modules/k8s/k8s.constants';
import {concatMap, from, map, Observable, of} from 'rxjs';
import { VELERO } from '@velero-ui-api/shared/modules/velero/velero.constants';
import { CreateDeleteBackupRequestDto } from '@velero-ui-api/shared/dto/delete-backup-request.dto';
import { createDeleteBackupRequest } from 'apps/velero-ui-api/src/app/modules/delete-backup-request/delete-backup-request.utils';
import { ConfigService } from '@nestjs/config';
import {Resources, V1DeleteBackupRequest} from '@velero-ui/velero';
import http from 'http';

@Injectable()
export class DeleteBackupRequestService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private configService: ConfigService
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }

  public create(
    body: CreateDeleteBackupRequestDto
  ): Observable<V1DeleteBackupRequest> {
    return of(
      createDeleteBackupRequest(
        body.name,
        this.configService.get('velero.namespace')
      )
    )
      .pipe(
        concatMap((request: V1DeleteBackupRequest) =>
          this.k8sCustomObjectApi.createNamespacedCustomObject(
            VELERO.GROUP,
            VELERO.VERSION,
            this.configService.get('velero.namespace'),
            Resources.DELETE_BACKUP_REQUEST.plurial,
            request
          )
        )
      )
      .pipe(
        map(
          (r: {
            response: http.IncomingMessage;
            body: V1DeleteBackupRequest;
          }) => r.body
        )
      );
  }
}
