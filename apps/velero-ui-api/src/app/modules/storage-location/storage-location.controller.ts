import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { StorageLocationService } from './storage-location.service';
import { Observable } from 'rxjs';
import { V1BackupStorageLocationList } from '@velero-ui/velero';

@Controller('storage-locations')
export class StorageLocationController {
  constructor(
    private readonly storageLocationService: StorageLocationService
  ) {}

  @Get()
  public get(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string
  ): Observable<V1BackupStorageLocationList> {
    return this.storageLocationService.find(offset, limit, search);
  }
}
