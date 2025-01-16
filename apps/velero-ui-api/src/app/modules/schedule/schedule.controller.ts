import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Observable } from 'rxjs';
import { Resources, V1Schedule, V1ScheduleList } from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import {
  CreateScheduleDto,
  EditScheduleDto,
} from '@velero-ui-api/shared/dto/schedule.dto';

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
      Resources.SCHEDULE.plural,
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
      Resources.SCHEDULE.plural,
      name,
    );
  }

  @Post()
  public create(@Body() data: CreateScheduleDto) {
    return this.scheduleService.create(data);
  }

  @Put('/:name')
  public editByName(
    @Param('name') name: string,
    @Body() data: EditScheduleDto,
  ) {
    return this.scheduleService.edit(name, data);
  }

  @Delete()
  public delete(@Body() names: string[]): Observable<void> {
    return this.k8sCustomObjectService.delete(Resources.SCHEDULE.plural, names);
  }

  @Delete('/:name')
  public deleteByName(@Param('name') name: string): Observable<void> {
    return this.k8sCustomObjectService.deleteByName(
      Resources.SCHEDULE.plural,
      name,
    );
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
