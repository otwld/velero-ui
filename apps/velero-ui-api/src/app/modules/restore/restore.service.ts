import { Injectable } from '@nestjs/common';
import { KubernetesObject } from '@kubernetes/client-node';
import { ConfigService } from '@nestjs/config';
import { concatMap, from, map, Observable, of } from 'rxjs';
import {
  Resources,
  V1DownloadRequest,
  V1DownloadTargetKind,
  V1Restore,
} from '@velero-ui/velero';
import { AxiosResponse } from 'axios';
import { unzipSync } from 'zlib';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import { DownloadRequestService } from '@velero-ui-api/modules/download-request/download-request.service';
import { HttpService } from '@nestjs/axios';
import { createK8sCustomObject } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.utils';
import { CreateRestoreDto } from '@velero-ui-api/shared/dto/restore.dto';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import { parseVeleroLog } from '@velero-ui-api/shared/utils/logs.utils';
import { VeleroLog } from '@velero-ui/shared-types';

@Injectable()
export class RestoreService {
  constructor(
    private readonly logger: AppLogger,
    private readonly downloadRequestService: DownloadRequestService,
    private readonly httpService: HttpService,
    private readonly k8sCustomObjectService: K8sCustomObjectService,
    private readonly configService: ConfigService
  ) {}

  public create(data: CreateRestoreDto): Observable<V1Restore> {
    return of(
      createK8sCustomObject(
        data.name,
        this.configService.get('velero.namespace'),
        Resources.RESTORE,
        data.labels,
        data.spec
      )
    ).pipe(
      concatMap((body: KubernetesObject) =>
        this.k8sCustomObjectService.create(Resources.RESTORE.plural, body)
      )
    );
  }

  public logs(name: string): Observable<VeleroLog[]> {
    this.logger.debug(`Getting logs for ${name}...`, RestoreService.name);

    return from(
      this.downloadRequestService.create({
        name,
        kind: V1DownloadTargetKind.RestoreLog,
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
}
