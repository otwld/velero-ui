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
import { RestoreService } from './restore.service';
import { Observable } from 'rxjs';
import {
  Ressources,
  V1DeleteBackupRequest,
  V1DownloadRequest,
  V1DownloadTargetKind,
  V1Restore,
  V1RestoreList,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/shared/modules/k8s-custom-object/k8s-custom-object.service';
import { DownloadRequestService } from '@velero-ui-api/modules/download-request/download-request.service';
import { DeleteBackupRequestService } from '@velero-ui-api/modules/delete-backup-request/delete-backup-request.service';

@Controller('restores')
export class RestoreController {
  constructor(
    private readonly restoreService: RestoreService,
    private readonly deleteBackupRequestService: DeleteBackupRequestService,
    private readonly downloadRequestService: DownloadRequestService,
    private readonly k8sCustomObjectService: K8sCustomObjectService
  ) {}

  @Get()
  public get(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string
  ): Observable<V1RestoreList> {
    return this.k8sCustomObjectService.get<V1Restore, V1RestoreList>(
      Ressources.RESTORE.plurial,
      offset,
      limit,
      search
    );
  }

  @Get('/:name')
  public getByName(@Param('name') name: string): Observable<V1Restore> {
    return this.k8sCustomObjectService.getByName<V1Restore>(
      Ressources.BACKUP.plurial,
      name
    );
  }

  @Post('/:name/logs/download')
  public downloadLogs(
    @Param('name') name: string
  ): Observable<V1DownloadRequest> {
    return this.downloadRequestService.create({
      name,
      kind: V1DownloadTargetKind.BackupLog,
    });
  }

  @Delete('/:name')
  public deleteByName(
    @Param('name') name: string
  ): Observable<V1DeleteBackupRequest> {
    return this.deleteBackupRequestService.create({
      name,
    });
  }
}
