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
  V1VolumeSnapshotLocation,
  V1VolumeSnapshotLocationList,
} from '@velero-ui/velero';

@Controller('snapshot-locations')
export class SnapshotLocationController {
  constructor(
    private readonly snapshotLocationService: SnapshotLocationService
  ) {}

  @Get()
  public get(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string
  ): Observable<V1VolumeSnapshotLocationList> {
    return this.snapshotLocationService.find(offset, limit, search);
  }

  @Get('/:name')
  public getByName(
    @Param('name') name: string
  ): Observable<V1VolumeSnapshotLocation> {
    return this.snapshotLocationService.findByName(name);
  }
}
