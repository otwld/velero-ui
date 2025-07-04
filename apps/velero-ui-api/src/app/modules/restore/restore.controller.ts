import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RestoreService } from './restore.service';
import { Observable } from 'rxjs';
import {
  Resources,
  V1DownloadRequest,
  V1DownloadTargetKind,
  V1Restore,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import { DownloadRequestService } from '@velero-ui-api/modules/download-request/download-request.service';
import { CreateRestoreDto } from '@velero-ui-api/shared/dto/restore.dto';
import { Subject } from '@velero-ui-api/shared/decorators/subject.decorator';
import { K8sCustomObjectController } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.controller';
import { CheckPolicies } from '@velero-ui-api/shared/decorators/check-policies.decorator';
import { AppAbility } from '@velero-ui-api/shared/modules/casl/casl-ability.factory';
import { Action, VeleroLog } from '@velero-ui/shared-types';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller(Resources.RESTORE.route)
@Subject(Resources.RESTORE.plural)
export class RestoreController extends K8sCustomObjectController<V1Restore> {
  constructor(
    private readonly restoreService: RestoreService,
    private readonly downloadRequestService: DownloadRequestService,
    readonly k8sCustomObjectService: K8sCustomObjectService
  ) {
    super(k8sCustomObjectService, Resources.RESTORE);
  }

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Resources.RESTORE.plural)
  )
  public create(@Body() data: CreateRestoreDto) {
    return this.restoreService.create(data);
  }

  @Get('/:name/logs')
  @UseInterceptors(CacheInterceptor)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Logs, Resources.RESTORE.plural)
  )
  public logs(@Param('name') name: string): Observable<VeleroLog[]> {
    return this.restoreService.logs(name);
  }
}
