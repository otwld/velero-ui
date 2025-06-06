import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { K8S_CONNECTION } from '@velero-ui-api/shared/utils/k8s.utils';
import { KubeConfig, KubernetesObject } from '@kubernetes/client-node';
import { catchError, concatMap, filter, from, map, Observable, of } from 'rxjs';
import {
  Resources,
  V1Backup,
  V1DeleteBackupRequest,
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
import { CreateBackupTypeEnum, VeleroLog } from '@velero-ui/shared-types';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import { createK8sCustomObject } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.utils';
import { parseVeleroLog } from '@velero-ui-api/shared/utils/logs.utils';

@Injectable()
export class BackupService {
  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private logger: AppLogger,
    private readonly downloadRequestService: DownloadRequestService,
    private readonly httpService: HttpService,
    private readonly k8sCustomObjectService: K8sCustomObjectService,
    private readonly configService: ConfigService
  ) {}

  public downloadByName(name: string) {
    return this.downloadRequestService
      .create({
        name,
        kind: V1DownloadTargetKind.BackupContents,
      })
      .pipe(
        concatMap((request: V1DownloadRequest) =>
          this.httpService.get(request.status.downloadURL, {
            responseType: 'stream',
          })
        )
      );
  }

  public logs(name: string): Observable<VeleroLog[]> {
    this.logger.debug(`Getting logs for ${name}...`, BackupService.name);

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
      .pipe(
        map((content: Buffer) =>
          content
            .toString()
            .split('\n')
            .map((line: string) => parseVeleroLog(line))
            .filter((log: VeleroLog) => !!log)
        )
      );
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
          data.spec
        )
      ).pipe(
        concatMap((body: KubernetesObject) =>
          this.k8sCustomObjectService.create(Resources.BACKUP.plural, body)
        )
      );
    } else if (
      data.type === CreateBackupTypeEnum.FROM_SCHEDULE &&
      data.spec instanceof CreateBackupScheduleDto
    ) {
      return from(
        this.k8sCustomObjectService.getByName<V1Schedule>(
          Resources.SCHEDULE.plural,
          data.spec.name
        )
      )
        .pipe(
          map(
            (schedule: V1Schedule): V1Backup =>
              createK8sCustomObject(
                data.name,
                this.configService.get('velero.namespace'),
                Resources.BACKUP,
                data.labels,
                schedule.spec.template
              )
          )
        )
        .pipe(
          concatMap((body: V1Backup) =>
            this.k8sCustomObjectService.create(Resources.BACKUP.plural, body)
          )
        );
    } else {
      throw new BadRequestException('Invalid body');
    }
  }

  public delete(names: string[]) {
    return from(names).pipe(
      concatMap((name: string) => this.deleteByName(name))
    );
  }

  public deleteByName(name: string): Observable<V1DeleteBackupRequest> {
    return of(
      createK8sCustomObject(
        name,
        this.configService.get('velero.namespace'),
        Resources.DELETE_BACKUP_REQUEST,
        {},
        {
          backupName: name,
        }
      )
    ).pipe(
      concatMap((body: KubernetesObject) =>
        this.k8sCustomObjectService.create(
          Resources.DELETE_BACKUP_REQUEST.plural,
          body
        )
      )
    );
  }

  public getContentSize(name: string): Observable<number> {
    return from(
      this.downloadRequestService.create({
        name,
        kind: V1DownloadTargetKind.BackupContents,
      })
    ).pipe(
      filter((request: V1DownloadRequest) => !!request.status?.downloadURL),
      concatMap((request: V1DownloadRequest) =>
        this.httpService
          .get(request.status.downloadURL, {
            headers: {
              Range: 'bytes=0-0',
            },
            responseType: 'arraybuffer',
          })
          .pipe(
            map((response: AxiosResponse) =>
              parseInt(
                response.headers['content-range']?.split('/')[1] || '0',
                10
              )
            ),
            catchError(() => of(0)),
            concatMap((size) =>
              this.k8sCustomObjectService
                .deleteByName(
                  Resources.DOWNLOAD_REQUEST.plural,
                  request.metadata.name
                )
                .pipe(
                  catchError((err) => {
                    return of(0);
                  }),
                  map(() => size)
                )
            )
          )
      )
    );
  }
}
