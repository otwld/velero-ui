import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { SnapshotLocationService } from './snapshot-location.service';
import { Observable } from 'rxjs';
import {
  Ressources,
  V1VolumeSnapshotLocation,
  V1VolumeSnapshotLocationList,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/shared/modules/k8s-custom-object/k8s-custom-object.service';

@Controller('snapshot-locations')
export class SnapshotLocationController {
  constructor(
    private readonly snapshotLocationService: SnapshotLocationService,
    private readonly k8sCustomObjectService: K8sCustomObjectService
  ) {}

  @Get()
  public get(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string
  ): Observable<V1VolumeSnapshotLocationList> {
    return this.k8sCustomObjectService.get<
      V1VolumeSnapshotLocation,
      V1VolumeSnapshotLocationList
    >(Ressources.VOLUME_SNAPSHOT_LOCATION.plurial, offset, limit, search);
  }

  @Get('/:name')
  public getByName(
    @Param('name') name: string
  ): Observable<V1VolumeSnapshotLocation> {
    return this.k8sCustomObjectService.getByName<V1VolumeSnapshotLocation>(
      Ressources.VOLUME_SNAPSHOT_LOCATION.plurial,
      name
    );
  }
}
