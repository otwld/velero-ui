import { Body, Controller, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Observable } from 'rxjs';
import { Resources, V1Schedule, V1ScheduleList } from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import {
  CreateScheduleDto,
  EditScheduleDto,
} from '@velero-ui-api/shared/dto/schedule.dto';
import { Subject } from '@velero-ui-api/shared/decorators/subject.decorator';
import { K8sCustomObjectController } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.controller';
import { CheckPolicies } from '@velero-ui-api/shared/decorators/check-policies.decorator';
import { AppAbility } from '@velero-ui-api/shared/modules/casl/casl-ability.factory';
import { Action } from '@velero-ui/shared-types';
import { CacheInterceptor } from "@nestjs/cache-manager";

@Controller(Resources.SCHEDULE.route)
@Subject(Resources.SCHEDULE.plural)
export class ScheduleController extends K8sCustomObjectController<
  V1Schedule,
  V1ScheduleList
> {
  constructor(
    private readonly scheduleService: ScheduleService,
    readonly k8sCustomObjectService: K8sCustomObjectService
  ) {
    super(k8sCustomObjectService, Resources.SCHEDULE);
  }

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Resources.SCHEDULE.plural)
  )
  public create(@Body() data: CreateScheduleDto) {
    return this.scheduleService.create(data);
  }

  @Put('/:name')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Resources.SCHEDULE.plural)
  )
  public editByName(
    @Param('name') name: string,
    @Body() data: EditScheduleDto
  ) {
    return this.scheduleService.edit(name, data);
  }

  @Post('/:name/pause')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Resources.SCHEDULE.plural)
  )
  public pause(@Param('name') name: string): Observable<V1Schedule> {
    return this.scheduleService.togglePause(name, true);
  }

  @Post('/:name/unpause')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Resources.SCHEDULE.plural)
  )
  public unpause(@Param('name') name: string): Observable<V1Schedule> {
    return this.scheduleService.togglePause(name, false);
  }

  @Get('/:name/stats')
  @UseInterceptors(CacheInterceptor)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Resources.SCHEDULE.plural)
  )
  public stats(@Param('name') name: string) {
    return this.scheduleService.stats(name);
  }
}
