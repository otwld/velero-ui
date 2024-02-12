import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { K8S_CONNECTION } from '@velero-ui-api/shared/modules/k8s/k8s.constants';
import { KubeConfig } from '@kubernetes/client-node';
import { HttpService } from '@nestjs/axios';
import { concatMap, from, map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import https from 'https';

@Injectable()
export class K8sHealthIndicator extends HealthIndicator {
  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private readonly httpService: HttpService
  ) {
    super();
  }

  public isHealthy(): Observable<HealthIndicatorResult> {
    const opts: any = {};

    return from(this.k8s.applyToRequest(opts))
      .pipe(
        map(
          () =>
            new https.Agent({
              rejectUnauthorized: false,
              ...opts,
            })
        )
      )
      .pipe(
        concatMap((agent) =>
          this.httpService.get(
            `${this.k8s.getCurrentCluster().server}/readyz`,
            {
              httpsAgent: agent,
            }
          )
        )
      )
      .pipe(
        map((result: AxiosResponse) =>
          this.getStatus('k8s', result.status === 200, result.data)
        )
      );
  }
}
