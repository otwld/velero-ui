import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { K8sHealthIndicator } from '@velero-ui-api/modules/health/health-indicators/k8s.health-indicator';
import { HttpModule } from '@nestjs/axios';
import { VeleroHealthIndicator } from '@velero-ui-api/modules/health/health-indicators/velero.health-indicator';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [K8sHealthIndicator, VeleroHealthIndicator],
})
export class HealthModule {}
