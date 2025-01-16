import { Inject, Injectable } from '@nestjs/common';
import {
  CustomObjectsApi,
  KubeConfig,
  PatchUtils,
} from '@kubernetes/client-node';
import { K8S_CONNECTION } from '../../shared/modules/k8s/k8s.constants';
import { concatMap, map, Observable, of, tap } from 'rxjs';
import { VELERO } from '../../shared/modules/velero/velero.constants';
import http from 'http';
import { Resources, V1Schedule } from '@velero-ui/velero';
import { ConfigService } from '@nestjs/config';
import { patchPauseSchedule } from './schedule.utils';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import {CreateScheduleDto, EditScheduleDto} from '@velero-ui-api/shared/dto/schedule.dto';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import {
  createK8sCustomObject,
  patchK8sCustomObjectSpec
} from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.utils';
import { KubernetesObjectWithSpec } from '@kubernetes/client-node/dist/types';
import {EditStorageLocationDto} from "@velero-ui-api/shared/dto/storage-location.dto";

@Injectable()
export class ScheduleService {
  private k8sCustomObjectApi: CustomObjectsApi;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private logger: AppLogger,
    private configService: ConfigService,
    private readonly k8sCustomObjectService: K8sCustomObjectService,
  ) {
    this.k8sCustomObjectApi = this.k8s.makeApiClient(CustomObjectsApi);
  }

  public create(data: CreateScheduleDto) {
    return of(
      createK8sCustomObject(
        data.name,
        this.configService.get('velero.namespace'),
        Resources.SCHEDULE,
        data.labels,
        data.spec,
      ),
    ).pipe(
      concatMap((body: KubernetesObjectWithSpec) =>
        this.k8sCustomObjectService.create(Resources.SCHEDULE.plural, body),
      ),
    );
  }

  public edit(name: string, data: EditScheduleDto) {
    return of(patchK8sCustomObjectSpec(data.spec)).pipe(
      concatMap((body) =>
        this.k8sCustomObjectService.edit(
          Resources.SCHEDULE.plural,
          name,
          body,
        ),
      ),
    );
  }

  public togglePause(name: string, paused: boolean): Observable<V1Schedule> {
    const options = {
      headers: { 'Content-type': PatchUtils.PATCH_FORMAT_JSON_PATCH },
    };

    this.logger.debug(
      `Toggle ${paused ? 'paused' : 'resumed'} for ${name}...`,
      ScheduleService.name,
    );

    return of(patchPauseSchedule(paused))
      .pipe(
        concatMap((body) =>
          this.k8sCustomObjectApi.patchNamespacedCustomObject(
            VELERO.GROUP,
            VELERO.VERSION,
            this.configService.get('velero.namespace'),
            Resources.SCHEDULE.plural,
            name,
            body,
            undefined,
            undefined,
            undefined,
            options,
          ),
        ),
      )
      .pipe(
        map(
          (r: { response: http.IncomingMessage; body: V1Schedule }) => r.body,
        ),
        tap(() =>
          this.logger.debug(
            `Toggle ${paused ? 'paused' : 'resumed'} for ${name}... SUCCESS`,
            ScheduleService.name,
          ),
        ),
      );
  }
}
