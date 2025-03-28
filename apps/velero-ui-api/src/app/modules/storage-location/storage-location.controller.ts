import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post, Put,
  Query,
} from '@nestjs/common';
import { StorageLocationService } from './storage-location.service';
import { Observable } from 'rxjs';
import {
  Resources,
  V1BackupStorageLocation,
  V1BackupStorageLocationList,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import {
  CreateStorageLocationDto,
  EditStorageLocationDto,
} from '@velero-ui-api/shared/dto/storage-location.dto';

@Controller(Resources.BACKUP_STORAGE_LOCATION.route)
export class StorageLocationController {
  constructor(
    private readonly storageLocationService: StorageLocationService,
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
  ): Observable<V1BackupStorageLocationList> {
    return this.k8sCustomObjectService.get<
      V1BackupStorageLocation,
      V1BackupStorageLocationList
    >(
      Resources.BACKUP_STORAGE_LOCATION.plural,
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
  ): Observable<V1BackupStorageLocation> {
    return this.k8sCustomObjectService.getByName<V1BackupStorageLocation>(
      Resources.BACKUP_STORAGE_LOCATION.plural,
      name,
    );
  }

  @Post()
  public create(@Body() data: CreateStorageLocationDto) {
    return this.storageLocationService.create(data);
  }

  @Put('/:name')
  public editByName(
    @Param('name') name: string,
    @Body() data: EditStorageLocationDto,
  ) {
    return this.storageLocationService.edit(name, data);
  }

  @Delete()
  public delete(@Body() names: string[]): Observable<void> {
    return this.k8sCustomObjectService.delete(
      Resources.BACKUP_STORAGE_LOCATION.plural,
      names,
    );
  }

  @Delete('/:name')
  public deleteByName(@Param('name') name: string): Observable<void> {
    return this.k8sCustomObjectService.deleteByName(
      Resources.BACKUP_STORAGE_LOCATION.plural,
      name,
    );
  }
}
