import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Observable } from 'rxjs';
import {
  Resources,
  V1DeleteBackupRequest,
  V1Schedule,
  V1ScheduleList,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/shared/modules/k8s-custom-object/k8s-custom-object.service';

@Controller(Resources.SCHEDULE.route)
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly k8sCustomObjectService: K8sCustomObjectService,
  ) {}

  @Get()
  public get(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('sortColumnName', new DefaultValuePipe('')) sortColumnName: string,
    @Query('sortColumnAscending', new DefaultValuePipe(''))
    sortColumnAscending: boolean,
  ): Observable<V1ScheduleList> {
    return this.k8sCustomObjectService.get<V1Schedule, V1ScheduleList>(
      Resources.SCHEDULE.plurial,
      offset,
      limit,
      search,
      sortColumnName,
      sortColumnAscending,
    );
  }

  @Get('/:name')
  public getByName(@Param('name') name: string): Observable<V1Schedule> {
    return this.k8sCustomObjectService.getByName<V1Schedule>(
      Resources.SCHEDULE.plurial,
      name,
    );
  }

  @Delete('/:name')
  public deleteByName(@Param('name') name: string): void {
    return this.scheduleService.deleteByName(name);
  }

  @Post('/:name/pause')
  public pause(@Param('name') name: string): Observable<V1Schedule> {
    return this.scheduleService.togglePause(name, true);
  }

  @Post('/:name/unpause')
  public unpause(@Param('name') name: string): Observable<V1Schedule> {
    return this.scheduleService.togglePause(name, false);
  }
}
