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
  V1PodVolumeRestore,
  V1PodVolumeRestoreList,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';

@Controller(Resources.POD_VOLUME_BACKUP.route)
export class PodVolumeRestoreController {
  constructor(
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
  ): Observable<V1PodVolumeRestore> {
    return this.k8sCustomObjectService.get<
      V1PodVolumeRestore,
      V1PodVolumeRestoreList
    >(
      Resources.POD_VOLUME_RESTORE.plural,
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
  ): Observable<V1PodVolumeRestore> {
    return this.k8sCustomObjectService.getByName<V1PodVolumeRestore>(
      Resources.POD_VOLUME_RESTORE.plural,
      name,
    );
  }

  @Delete()
  public delete(@Body() names: string[]): Observable<void> {
    return this.k8sCustomObjectService.delete(
      Resources.POD_VOLUME_RESTORE.plural,
      names,
    );
  }

  @Delete('/:name')
  public deleteByName(@Param('name') name: string): Observable<void> {
    return this.k8sCustomObjectService.deleteByName(
      Resources.POD_VOLUME_RESTORE.plural,
      name,
    );
  }
}
