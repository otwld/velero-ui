import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  Ressources,
  V1DeleteBackupRequest,
  V1DeleteBackupRequestList,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/shared/modules/k8s-custom-object/k8s-custom-object.service';
import { DeleteBackupRequestService } from '@velero-ui-api/modules/delete-backup-request/delete-backup-request.service';

@Controller('delete-backup-requests')
export class DeleteBackupRequestController {
  constructor(
    private readonly deleteBackupRequestService: DeleteBackupRequestService,
    private readonly k8sCustomObjectService: K8sCustomObjectService
  ) {}

  @Get()
  public get(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string
  ): Observable<V1DeleteBackupRequestList> {
    return this.k8sCustomObjectService.get<
      V1DeleteBackupRequest,
      V1DeleteBackupRequestList
    >(Ressources.DELETE_BACKUP_REQUEST.plurial, offset, limit, search);
  }

  @Get('/:name')
  public getByName(@Param('name') name: string): Observable<V1DeleteBackupRequest> {
    return this.k8sCustomObjectService.getByName<V1DeleteBackupRequest>(
      Ressources.DELETE_BACKUP_REQUEST.plurial,
      name
    );
  }
}
