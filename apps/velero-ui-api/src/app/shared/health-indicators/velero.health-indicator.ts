import { Injectable } from '@nestjs/common';
import { V1PodStatus } from '@kubernetes/client-node';
import { from, map, Observable } from 'rxjs';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { VeleroService } from '../modules/velero/velero.service';

@Injectable()
export class VeleroHealthIndicator extends HealthIndicator {
  constructor(private readonly veleroService: VeleroService) {
    super();
  }

  public isHealthy(): Observable<HealthIndicatorResult> {
    return from(this.veleroService.getServerStatus()).pipe(
      map((podStatus: V1PodStatus) =>
        this.getStatus('velero', podStatus?.phase === 'Running', {
          phase: podStatus?.phase,
        })
      )
    );
  }
}
