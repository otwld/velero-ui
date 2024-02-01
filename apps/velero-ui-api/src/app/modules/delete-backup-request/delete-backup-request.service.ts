import { Inject, Injectable } from '@nestjs/common';
import { CustomObjectsApi, KubeConfig } from '@kubernetes/client-node';
import { K8S_CONNECTION } from '../../shared/modules/k8s/k8s.constants';
import { VeleroService } from '../../shared/modules/velero/velero.service';
import { concatMap, Observable, of } from 'rxjs';
import { DeleteBackupRequest } from '../../shared/models/velero.models';
import { VELERO } from '../../shared/constants/velero.constants';
import { CreateDeleteBackRequestDto } from '../../shared/dto/delete-backup-request.dto';
import { createDeleteBackupRequest } from './delete-backup-request.utils';

@Injectable()
export class DeleteBackupRequestService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private readonly veleroService: VeleroService
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }

  public create(body: CreateDeleteBackRequestDto) {
    return of(createDeleteBackupRequest(body.name, body.namespace)).pipe(
      concatMap((request: DeleteBackupRequest) =>
        this.k8sCustomObjectApi.createClusterCustomObject(
          VELERO.GROUP,
          VELERO.VERSION,
          VELERO.PLURAL_DELETE_BACKUP_REQUEST,
          request
        )
      )
    );
  }
}
