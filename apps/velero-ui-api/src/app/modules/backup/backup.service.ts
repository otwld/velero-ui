import { Inject, Injectable } from '@nestjs/common';
import { K8S_CONNECTION } from '../../shared/modules/k8s/k8s.constants';
import {
  CustomObjectsApi,
  KubeConfig,
} from '@kubernetes/client-node';
import { concatMap, map, Observable } from 'rxjs';
import { from } from 'rxjs';
import {
  V1DownloadTargetKind,
  V1DownloadRequest,
} from '@velero-ui/velero';
import { DownloadRequestService } from '@velero-ui-api/modules/download-request/download-request.service';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { unzipSync } from 'zlib';

@Injectable()
export class BackupService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private readonly downloadRequestService: DownloadRequestService,
    private readonly httpService: HttpService
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }

  public logs(name: string): Observable<string[]> {
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
      .pipe(map((content: Buffer) => content.toString().split('\n')));
  }
}
