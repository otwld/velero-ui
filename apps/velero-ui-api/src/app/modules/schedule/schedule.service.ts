import { Inject, Injectable } from '@nestjs/common';
import {
  CustomObjectsApi,
  KubeConfig,
  PatchUtils,
} from '@kubernetes/client-node';
import { K8S_CONNECTION } from '../../shared/modules/k8s/k8s.constants';
import {catchError, concatMap, from, map, Observable, of, tap} from 'rxjs';
import { VELERO } from '../../shared/modules/velero/velero.constants';
import http from 'http';
import { Ressources, V1Schedule, V1ScheduleList } from '@velero-ui/velero';
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

  public find(
    offset: number = 0,
    limit: number = 20,
    search?: string
  ): Observable<V1ScheduleList> {
    return from(
      this.k8sCustomObjectApi.listNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        Ressources.SCHEDULE.plurial
      )
    )
      .pipe(
        map(
          (r: {
            response: http.IncomingMessage;
            body: V1ScheduleList;
          }): V1ScheduleList => r.body
        )
      )
      .pipe(
        map((r: V1ScheduleList) => ({
          ...r,
          total: r.items.length,
          items: (r.items = r.items
            .filter((i: V1Schedule) => i.metadata.name.includes(search))
            .slice(offset, offset + limit)),
        }))
      );
  }

  public findByName(name: string): Observable<V1Schedule> {
    return from(
      this.k8sCustomObjectApi.getNamespacedCustomObject(
        VELERO.GROUP,
        VELERO.VERSION,
        this.configService.get('velero.namespace'),
        Ressources.SCHEDULE.plurial,
        name
      )
    ).pipe(
      map((r: { response: http.IncomingMessage; body: V1Schedule }) => r.body)
    );
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
            Ressources.SCHEDULE.plurial,
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
