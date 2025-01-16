import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  Resources,
  V1DeleteBackupRequest,
  V1DeleteBackupRequestList,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import { DeleteBackupRequestService } from '@velero-ui-api/modules/delete-backup-request/delete-backup-request.service';

@Controller(Resources.DELETE_BACKUP_REQUEST.route)
export class DeleteBackupRequestController {
  constructor(
    private readonly deleteBackupRequestService: DeleteBackupRequestService,
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
  ): Observable<V1DeleteBackupRequestList> {
    return this.k8sCustomObjectService.get<
      V1DeleteBackupRequest,
      V1DeleteBackupRequestList
    >(
      Resources.DELETE_BACKUP_REQUEST.plural,
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
  ): Observable<V1DeleteBackupRequest> {
    return this.k8sCustomObjectService.getByName<V1DeleteBackupRequest>(
      Resources.DELETE_BACKUP_REQUEST.plural,
      name,
    );
  }

  @Delete()
  public delete(@Body() names: string[]): Observable<void> {
    return this.k8sCustomObjectService.delete(
      Resources.DELETE_BACKUP_REQUEST.plural,
      names,
    );
  }

  @Delete('/:name')
  public deleteByName(@Param('name') name: string): Observable<void> {
    return this.k8sCustomObjectService.deleteByName(
      Resources.DELETE_BACKUP_REQUEST.plural,
      name,
    );
  }
}
