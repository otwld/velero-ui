import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { K8S_CONNECTION } from '@velero-ui-api/shared/utils/k8s.utils';
import { Health, KubeConfig } from '@kubernetes/client-node';
import {from, map, Observable} from 'rxjs';
import https from 'https';

@Injectable()
export class K8sHealthIndicator extends HealthIndicator {
  private health: Health;

  constructor(@Inject(K8S_CONNECTION) private readonly k8s: KubeConfig) {
    super();
    this.health = new Health(k8s);
  }

  public isHealthy(): Observable<HealthIndicatorResult> {
    return from(
      this.health.readyz({
        agent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }),
    ).pipe(map((alive: boolean) => this.getStatus('k8s', alive)));
  }
}
