import { Controller, Get } from '@nestjs/common';
import { StatsService } from '@velero-ui-api/modules/stats/stats.service';
import { Observable } from 'rxjs';
import { BasicStats } from '@velero-ui/shared-types';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  public getBasicStats(): Observable<BasicStats> {
    return this.statsService.getBasicStats();
  }
}
