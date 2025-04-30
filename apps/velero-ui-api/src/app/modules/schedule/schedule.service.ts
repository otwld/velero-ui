import { Inject, Injectable } from '@nestjs/common';
import {
  CustomObjectsApi,
  KubeConfig,
  KubernetesObject,
} from '@kubernetes/client-node';
import { K8S_CONNECTION } from '@velero-ui-api/shared/utils/k8s.utils';
import { concatMap, Observable, of, tap } from 'rxjs';
import { Resources, V1Schedule } from '@velero-ui/velero';
import { ConfigService } from '@nestjs/config';
import { patchPauseSchedule } from './schedule.utils';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import {
  CreateScheduleDto,
  EditScheduleDto,
} from '@velero-ui-api/shared/dto/schedule.dto';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import {
  createK8sCustomObject,
  patchK8sCustomObjectSpec,
} from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.utils';
import { VELERO } from '@velero-ui-api/shared/modules/velero/velero.constants';
import {PatchStrategy, setHeaderOptions} from "@kubernetes/client-node"

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

  public create(data: CreateScheduleDto): Observable<V1Schedule> {
    return of(
      createK8sCustomObject(
        data.name,
        this.configService.get('velero.namespace'),
        Resources.SCHEDULE,
        data.labels,
        data.spec,
      ),
    ).pipe(
      concatMap((body: KubernetesObject) =>
        this.k8sCustomObjectService.create(Resources.SCHEDULE.plural, body),
      ),
    );
  }

  public edit(name: string, data: EditScheduleDto): Observable<V1Schedule> {
    return of(patchK8sCustomObjectSpec(data.spec)).pipe(
      concatMap((body) =>
        this.k8sCustomObjectService.edit(Resources.SCHEDULE.plural, name, body),
      ),
    );
  }

  public togglePause(name: string, paused: boolean): Observable<V1Schedule> {
    this.logger.debug(
      `Toggle ${paused ? 'paused' : 'resumed'} for ${name}...`,
      ScheduleService.name,
    );

    return of(patchPauseSchedule(paused))
      .pipe(
        concatMap((body) =>
          this.k8sCustomObjectApi.patchNamespacedCustomObject(
            {
              group: VELERO.GROUP,
              version: VELERO.VERSION,
              namespace: this.configService.get('velero.namespace'),
              plural: Resources.SCHEDULE.plural,
              name,
              body,
            },
            setHeaderOptions('Content-Type', PatchStrategy.JsonPatch),
          ),
        ),
      )
      .pipe(
        tap(() =>
          this.logger.debug(
            `Toggle ${paused ? 'paused' : 'resumed'} for ${name}... SUCCESS`,
            ScheduleService.name,
          ),
        ),
      );
  }
}
