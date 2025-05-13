import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RestoreService } from './restore.service';
import { Observable } from 'rxjs';
import {
  Resources,
  V1DownloadRequest,
  V1DownloadTargetKind,
  V1Restore,
  V1RestoreList,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import { DownloadRequestService } from '@velero-ui-api/modules/download-request/download-request.service';
import { CreateRestoreDto } from '@velero-ui-api/shared/dto/restore.dto';
import { Subject } from '@velero-ui-api/shared/decorators/subject.decorator';
import { K8sCustomObjectController } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.controller';
import { CheckPolicies } from "@velero-ui-api/shared/decorators/check-policies.decorator";
import { AppAbility } from "@velero-ui-api/shared/modules/casl/casl-ability.factory";
import { Action } from "@velero-ui/shared-types";

@Controller(Resources.RESTORE.route)
@Subject(Resources.RESTORE.plural)
export class RestoreController extends K8sCustomObjectController<
  V1Restore,
  V1RestoreList
> {
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
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Logs, Resources.RESTORE.plural)
  )
  public logs(@Param('name') name: string): Observable<string[]> {
    return this.restoreService.logs(name);
  }

  @Post('/:name/logs/download')
  @CheckPolicies(
    (ability: AppAbility) =>
      ability.can(Action.Logs, Resources.RESTORE.plural) &&
      ability.can(Action.Download, Resources.RESTORE.plural)
  )
  public downloadLogs(
    @Param('name') name: string
  ): Observable<V1DownloadRequest> {
    return this.downloadRequestService.create({
      name,
      kind: V1DownloadTargetKind.RestoreLog,
    });
  }
}
