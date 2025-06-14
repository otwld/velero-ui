import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { BackupService } from './backup.service';
import { forkJoin, lastValueFrom, Observable } from 'rxjs';
import {
  PluralsNames,
  Resources,
  V1Backup,
  V1DownloadTargetKind,
} from '@velero-ui/velero';
import { DownloadRequestService } from '@velero-ui-api/modules/download-request/download-request.service';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import { CreateBackupDto } from '@velero-ui-api/shared/dto/backup.dto';
import { CheckPolicies } from '@velero-ui-api/shared/decorators/check-policies.decorator';
import { AppAbility } from '@velero-ui-api/shared/modules/casl/casl-ability.factory';
import { Action, VeleroLog } from '@velero-ui/shared-types';
import { K8sCustomObjectController } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.controller';
import { Subject } from '@velero-ui-api/shared/decorators/subject.decorator';
import { K8sCustomObjectParams } from '@velero-ui-api/shared/dto/k8s-custom-object.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Response } from 'express';

@Controller(Resources.BACKUP.route)
@Subject(Resources.BACKUP.plural)
export class BackupController extends K8sCustomObjectController<V1Backup> {
  constructor(
    private readonly backupService: BackupService,
    private readonly downloadRequestService: DownloadRequestService,
    readonly k8sCustomObjectService: K8sCustomObjectService
  ) {
    super(k8sCustomObjectService, Resources.BACKUP);
  }

  @Post('/download')
  public download(@Body() names: string[]) {
    return forkJoin(
      names.map((name) =>
        this.downloadRequestService.create({
          name,
          kind: V1DownloadTargetKind.BackupContents,
        })
      )
    );
  }

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Resources.BACKUP.plural)
  )
  public create(@Body() data: CreateBackupDto) {
    return this.backupService.create(data);
  }

  @Get('/:name/logs')
  @UseInterceptors(CacheInterceptor)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Logs, Resources.BACKUP.plural)
  )
  public logs(@Param('name') name: string): Observable<VeleroLog[]> {
    return this.backupService.logs(name);
  }

  @Get('/:name/download')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Download, Resources.BACKUP.plural)
  )
  public async downloadByName(
    @Param('name') name: string,
    @Res() res: Response
  ) {
    const response = await lastValueFrom(
      this.backupService.downloadByName(name)
    );

    res.setHeader('Content-Disposition', `attachment; filename=${name}.tar.gz`);

    response.data.pipe(res);
  }

  @Delete()
  @CheckPolicies((ability: AppAbility, resource: PluralsNames) =>
    ability.can(Action.Delete, resource)
  )
  public delete(
    @Body() names: string[],
    @Query('forced', new DefaultValuePipe(false), ParseBoolPipe) forced: boolean
  ) {
    if (forced) {
      return super.delete(names, forced);
    }
    return this.backupService.delete(names);
  }

  @Delete('/:name')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, Resources.BACKUP.plural)
  )
  protected deleteByName(
    @Param() params: K8sCustomObjectParams,
    @Query('forced', new DefaultValuePipe(false), ParseBoolPipe) forced: boolean
  ) {
    if (forced) {
      return super.deleteByName(params, forced);
    }
    return this.backupService.deleteByName(params.name);
  }
}
