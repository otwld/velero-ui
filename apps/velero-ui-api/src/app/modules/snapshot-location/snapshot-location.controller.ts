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
import { SnapshotLocationService } from './snapshot-location.service';
import { Observable } from 'rxjs';
import {
  Resources,
  V1VolumeSnapshotLocation,
  V1VolumeSnapshotLocationList,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/shared/modules/k8s-custom-object/k8s-custom-object.service';

@Controller(Resources.VOLUME_SNAPSHOT_LOCATION.route)
export class SnapshotLocationController {
  constructor(
    private readonly snapshotLocationService: SnapshotLocationService,
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
  ): Observable<V1VolumeSnapshotLocationList> {
    return this.k8sCustomObjectService.get<
      V1VolumeSnapshotLocation,
      V1VolumeSnapshotLocationList
    >(
      Resources.VOLUME_SNAPSHOT_LOCATION.plurial,
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
  ): Observable<V1VolumeSnapshotLocation> {
    return this.k8sCustomObjectService.getByName<V1VolumeSnapshotLocation>(
      Resources.VOLUME_SNAPSHOT_LOCATION.plurial,
      name,
    );
  }

  @Delete()
  public delete(@Body() names: string[]): void {
    return this.k8sCustomObjectService.delete(
      Resources.VOLUME_SNAPSHOT_LOCATION.plurial,
      names,
    );
  }

  @Delete('/:name')
  public deleteByName(@Param('name') name: string): void {
    return this.k8sCustomObjectService.deleteByName(
      Resources.VOLUME_SNAPSHOT_LOCATION.plurial,
      name,
    );
  }
}
