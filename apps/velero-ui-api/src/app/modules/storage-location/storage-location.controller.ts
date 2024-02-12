import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { StorageLocationService } from './storage-location.service';
import { Observable } from 'rxjs';
import {
  Ressources,
  V1BackupStorageLocation,
  V1BackupStorageLocationList,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/shared/modules/k8s-custom-object/k8s-custom-object.service';

@Controller('storage-locations')
export class StorageLocationController {
  constructor(
    private readonly storageLocationService: StorageLocationService,
    private readonly k8sCustomObjectService: K8sCustomObjectService
  ) {}

  @Get()
  public get(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string
  ): Observable<V1BackupStorageLocationList> {
    return this.k8sCustomObjectService.get<
      V1BackupStorageLocation,
      V1BackupStorageLocationList
    >(Ressources.BACKUP_STORAGE_LOCATION.plurial, offset, limit, search);
  }

  @Get('/:name')
  public getByName(
    @Param('name') name: string
  ): Observable<V1BackupStorageLocation> {
    return this.k8sCustomObjectService.getByName<V1BackupStorageLocation>(
      Ressources.BACKUP_STORAGE_LOCATION.plurial,
      name
    );
  }
}
