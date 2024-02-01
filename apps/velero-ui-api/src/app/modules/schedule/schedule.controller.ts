import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Observable } from 'rxjs';
import { V1Schedule, V1ScheduleList } from '@velero-ui/shared-types';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  public get(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string
  ): Observable<V1ScheduleList> {
    return this.scheduleService.find(offset, limit, search);
  }

  @Get('/:namespace/:name')
  public getByName(
    @Param('name') name: string,
    @Param('namespace') namespace: string
  ): Observable<V1Schedule> {
    return this.scheduleService.findByName(name, namespace);
  }
}
