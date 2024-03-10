import { Controller, Get } from '@nestjs/common';
import { StatsService } from '@velero-ui-api/modules/stats/stats.service';
import { Observable } from 'rxjs';
import {
  BackupsStatusStats,
  BackupsSuccessRateStats,
  BasicStats, RestoresStatusStats, RestoresSuccessRateStats,
} from '@velero-ui/shared-types';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  public getBasicStats(): Observable<BasicStats> {
    return this.statsService.getBasicStats();
  }

  @Get('/backups/status')
  public getBackupsStatus(): Observable<BackupsStatusStats> {
    return this.statsService.getBackupsStatus();
  }

  @Get('/backups/success-rate')
  public getBackupsSuccessRate(): Observable<BackupsSuccessRateStats> {
    return this.statsService.getBackupsSuccessRate();
  }

  @Get('/restores/status')
  public getRestoresStatus(): Observable<RestoresStatusStats> {
    return this.statsService.getRestoresStatus();
  }

  @Get('/restores/success-rate')
  public getRestoresSuccessRate(): Observable<RestoresSuccessRateStats> {
    return this.statsService.getRestoresSuccessRate();
  }
}
