import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { K8S_CONNECTION } from '../../shared/modules/k8s/k8s.constants';
import { CustomObjectsApi, KubeConfig } from '@kubernetes/client-node';
import { concatMap, from, map, Observable, of } from 'rxjs';
import {
  Resources,
  V1Backup,
  V1DownloadRequest,
  V1DownloadTargetKind,
  V1Schedule,
} from '@velero-ui/velero';
import { DownloadRequestService } from '@velero-ui-api/modules/download-request/download-request.service';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { unzipSync } from 'zlib';
import {
  CreateBackupDto,
  CreateBackupScheduleDto,
  CreateBackupScratchDto,
} from '@velero-ui-api/shared/dto/backup.dto';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import { ConfigService } from '@nestjs/config';
import { CreateBackupTypeEnum } from '@velero-ui/shared-types';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import { createK8sCustomObject } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.utils';
import { KubernetesObjectWithSpec } from '@kubernetes/client-node/dist/types';

@Injectable()
export class BackupService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private logger: AppLogger,
    private readonly downloadRequestService: DownloadRequestService,
    private readonly httpService: HttpService,
    private readonly k8sCustomObjectService: K8sCustomObjectService,
    private configService: ConfigService,
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }

  public logs(name: string): Observable<string[]> {
    this.logger.debug(`Getting logs for ${name}...`, BackupService.name);

    return from(
      this.downloadRequestService.create({
        name,
        kind: V1DownloadTargetKind.BackupLog,
      }),
    )
      .pipe(
        concatMap(
          (
            downloadRequest: V1DownloadRequest,
          ): Observable<AxiosResponse<ArrayBuffer>> =>
            this.httpService.get(downloadRequest?.status?.downloadURL, {
              responseType: 'arraybuffer',
            }),
        ),
      )
      .pipe(map((response: AxiosResponse<ArrayBuffer>) => response.data))
      .pipe(map((buffer: ArrayBuffer) => unzipSync(buffer)))
      .pipe(map((content: Buffer) => content.toString().split('\n')));
  }

  public create(data: CreateBackupDto) {
    if (
      data.type === CreateBackupTypeEnum.FROM_SCRATCH &&
      data.spec instanceof CreateBackupScratchDto
    ) {
      return of(
        createK8sCustomObject(
          data.name,
          this.configService.get('velero.namespace'),
          Resources.BACKUP,
          data.labels,
          data.spec,
        ),
      ).pipe(
        concatMap((body: KubernetesObjectWithSpec) =>
          this.k8sCustomObjectService.create(Resources.BACKUP.plural, body),
        ),
      );
    } else if (
      data.type === CreateBackupTypeEnum.FROM_SCHEDULE &&
      data.spec instanceof CreateBackupScheduleDto
    ) {
      return from(
        this.k8sCustomObjectService.getByName<V1Schedule>(
          Resources.SCHEDULE.plural,
          data.spec.name,
        ),
      )
        .pipe(
          map(
            (schedule: V1Schedule): V1Backup =>
              createK8sCustomObject(
                data.name,
                this.configService.get('velero.namespace'),
                Resources.BACKUP,
                data.labels,
                schedule.spec.template,
              ),
          ),
        )
        .pipe(
          concatMap((body: V1Backup) =>
            this.k8sCustomObjectService.create(Resources.BACKUP.plural, body),
          ),
        );
    } else {
      throw new BadRequestException('Invalid body');
    }
  }
}
