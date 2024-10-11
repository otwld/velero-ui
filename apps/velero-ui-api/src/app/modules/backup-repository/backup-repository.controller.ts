import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { DeleteBackupRequestService } from '@velero-ui-api/modules/delete-backup-request/delete-backup-request.service';
import { DownloadRequestService } from '@velero-ui-api/modules/download-request/download-request.service';
import { K8sCustomObjectService } from '@velero-ui-api/shared/modules/k8s-custom-object/k8s-custom-object.service';
import { BackupRepositoryService } from '@velero-ui-api/modules/backup-repository/backup-repository.service';
import { Observable } from 'rxjs';
import {
  Resources,
  V1BackupRepository,
  V1BackupRepositoryList,
  V1DeleteBackupRequest,
} from '@velero-ui/velero';

@Controller(Resources.BACKUP_REPOSITORY.route)
export class BackupRepositoryController {
  constructor(
    private readonly backupRepositoryService: BackupRepositoryService,
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
  ): Observable<V1BackupRepositoryList> {
    return this.k8sCustomObjectService.get<
      V1BackupRepository,
      V1BackupRepositoryList
    >(
      Resources.BACKUP_REPOSITORY.plurial,
      offset,
      limit,
      search,
      sortColumnName,
      sortColumnAscending,
    );
  }

  @Get('/:name')
  public getByName(
    @Param('name') name: string,
  ): Observable<V1BackupRepository> {
    return this.k8sCustomObjectService.getByName<V1BackupRepository>(
      Resources.BACKUP_REPOSITORY.plurial,
      name,
    );
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
