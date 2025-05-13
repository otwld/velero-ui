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
import { BackupService } from './backup.service';
import { forkJoin, Observable } from 'rxjs';
import {
  Resources,
  V1Backup,
  V1BackupList,
  V1DeleteBackupRequest,
  V1DownloadRequest,
  V1DownloadTargetKind,
} from '@velero-ui/velero';
import { DeleteBackupRequestService } from '@velero-ui-api/modules/delete-backup-request/delete-backup-request.service';
import { DownloadRequestService } from '@velero-ui-api/modules/download-request/download-request.service';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import { CreateBackupDto } from '@velero-ui-api/shared/dto/backup.dto';

@Controller(Resources.BACKUP.route)
export class BackupController {
  constructor(
    private readonly backupService: BackupService,
    private readonly deleteBackupRequestService: DeleteBackupRequestService,
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
  ): Observable<V1BackupList> {
    return this.k8sCustomObjectService.get<V1Backup, V1BackupList>(
      Resources.BACKUP.plural,
      offset,
      limit,
      search,
      sortColumnName,
      sortColumnAscending,
    );
  }

  @Post('/download')
  public download(@Body() names: string[]) {
    return forkJoin(
      names.map((name) =>
        this.downloadRequestService.create({
          name,
          kind: V1DownloadTargetKind.BackupContents,
        }),
      ),
    );
  }

  @Delete()
  public delete(@Body() names: string[]) {
    return forkJoin(
      names.map((name) => this.deleteBackupRequestService.create({ name })),
    );
  }

  @Post()
  public create(@Body() data: CreateBackupDto) {
    return this.backupService.create(data);
  }

  @Get('/:name')
  public getByName(@Param('name') name: string): Observable<V1Backup> {
    return this.k8sCustomObjectService.getByName<V1Backup>(
      Resources.BACKUP.plural,
      name,
    );
  }

  @Get('/:name/logs')
  public logs(@Param('name') name: string): Observable<string[]> {
    return this.backupService.logs(name);
  }

  @Post('/:name/logs/download')
  public downloadLogs(
    @Param('name') name: string,
  ): Observable<V1DownloadRequest> {
    return this.downloadRequestService.create({
      name,
      kind: V1DownloadTargetKind.BackupLog,
    });
  }

  @Post('/:name/download')
  public downloadByName(
    @Param('name') name: string,
  ): Observable<V1DownloadRequest> {
    return this.downloadRequestService.create({
      name,
      kind: V1DownloadTargetKind.BackupContents,
    });
  }

  @Delete('/:name')
  public deleteByName(
    @Param('name') name: string,
  ): Observable<V1DeleteBackupRequest> {
    return this.deleteBackupRequestService.create({
      name,
    });
  }
}
