import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
} from '@nestjs/terminus';
import { K8sHealthIndicator } from '../../shared/health-indicators/k8s.health-indicator';
import { lastValueFrom } from 'rxjs';
import { VeleroHealthIndicator } from '../../shared/health-indicators/velero.health-indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private velero: VeleroHealthIndicator,
    private k8s: K8sHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => lastValueFrom(this.k8s.isHealthy()),
      () => lastValueFrom(this.velero.isHealthy()),
    ]);
  }
}
