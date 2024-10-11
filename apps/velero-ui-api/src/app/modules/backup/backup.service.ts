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
  CreateBackupDataFromScheduleDto,
  CreateBackupDataFromScratchDto,
  CreateBackupDto,
} from '@velero-ui-api/shared/dto/backup.dto';
import { K8sCustomObjectService } from '@velero-ui-api/shared/modules/k8s-custom-object/k8s-custom-object.service';
import { createBackup } from '@velero-ui-api/modules/backup/backup.utils';
import { ConfigService } from '@nestjs/config';
import { CreateBackupTypeEnum } from '@velero-ui/shared-types';

@Injectable()
export class BackupService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private readonly downloadRequestService: DownloadRequestService,
    private readonly httpService: HttpService,
    private readonly k8sCustomObjectService: K8sCustomObjectService,
    private configService: ConfigService,
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }

  public logs(name: string): Observable<string[]> {
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
      data.data instanceof CreateBackupDataFromScratchDto
    ) {
      console.log('From scratch');
      return of(
        createBackup(
          data.name,
          this.configService.get('velero.namespace'),
          data.labels,
          data.data,
        ),
      ).pipe(
        concatMap((body: V1Backup) =>
          this.k8sCustomObjectService.create(Resources.BACKUP.plurial, body),
        ),
      );
    } else if (
      data.type === CreateBackupTypeEnum.FROM_SCHEDULE &&
      data.data instanceof CreateBackupDataFromScheduleDto
    ) {
      return from(
        this.k8sCustomObjectService.getByName<V1Schedule>(
          Resources.SCHEDULE.plurial,
          data.data.name,
        ),
      )
        .pipe(
          map(
            (schedule: V1Schedule): V1Backup =>
              createBackup(
                data.name,
                this.configService.get('velero.namespace'),
                data.labels,
                schedule.spec.template,
              ),
          ),
        )
        .pipe(
          concatMap((body: V1Backup) =>
            this.k8sCustomObjectService.create(Resources.BACKUP.plurial, body),
          ),
        );
    } else {
      throw new BadRequestException('Invalid body');
    }
  }
}
