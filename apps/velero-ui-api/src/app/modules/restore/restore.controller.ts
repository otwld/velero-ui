import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
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

@Controller(Resources.RESTORE.route)
export class RestoreController {
  constructor(
    private readonly restoreService: RestoreService,
    private readonly downloadRequestService: DownloadRequestService,
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
  ): Observable<V1RestoreList> {
    return this.k8sCustomObjectService.get<V1Restore, V1RestoreList>(
      Resources.RESTORE.plural,
      offset,
      limit,
      search,
      sortColumnName,
      sortColumnAscending,
    );
  }

  @Get('/:name')
  public getByName(@Param('name') name: string): Observable<V1Restore> {
    return this.k8sCustomObjectService.getByName<V1Restore>(
      Resources.RESTORE.plural,
      name,
    );
  }

  @Post()
  public create(@Body() data: CreateRestoreDto) {
    return this.restoreService.create(data);
  }

  @Get('/:name/logs')
  public logs(@Param('name') name: string): Observable<string[]> {
    return this.restoreService.logs(name);
  }

  @Post('/:name/logs/download')
  public downloadLogs(
    @Param('name') name: string,
  ): Observable<V1DownloadRequest> {
    return this.downloadRequestService.create({
      name,
      kind: V1DownloadTargetKind.RestoreLog,
    });
  }

  @Delete()
  public delete(@Body() names: string[]): Observable<void> {
    return this.k8sCustomObjectService.delete(Resources.RESTORE.plural, names);
  }

  @Delete('/:name')
  public deleteByName(@Param('name') name: string) {
    return this.k8sCustomObjectService.deleteByName(
      Resources.RESTORE.plural,
      name,
    );
  }
}
