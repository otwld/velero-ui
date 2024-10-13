import { Inject, Injectable } from '@nestjs/common';
import {
  CustomObjectsApi,
  KubeConfig,
  PatchUtils,
} from '@kubernetes/client-node';
import { K8S_CONNECTION } from '../../shared/modules/k8s/k8s.constants';
import {concatMap, from, map, Observable, of} from 'rxjs';
import { VELERO } from '../../shared/modules/velero/velero.constants';
import http from 'http';
import { Resources, V1Schedule } from '@velero-ui/velero';
import { ConfigService } from '@nestjs/config';
import { patchPauseSchedule } from './schedule.utils';

@Injectable()
export class ScheduleService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private configService: ConfigService
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }

  public togglePause(name: string, paused: boolean): Observable<V1Schedule> {
    const options = {
      headers: { 'Content-type': PatchUtils.PATCH_FORMAT_JSON_PATCH },
    };

    return of(patchPauseSchedule(paused))
      .pipe(
        concatMap((body) =>
          this.k8sCustomObjectApi.patchNamespacedCustomObject(
            VELERO.GROUP,
            VELERO.VERSION,
            this.configService.get('velero.namespace'),
            Resources.SCHEDULE.plurial,
            name,
            body,
            undefined,
            undefined,
            undefined,
            options
          )
        )
      )
      .pipe(
        map((r: { response: http.IncomingMessage; body: V1Schedule }) => r.body)
      );
  }
}
