import { Module } from '@nestjs/common';
import { StorageLocationController } from './storage-location.controller';
import { StorageLocationService } from './storage-location.service';

@Module({
  controllers: [StorageLocationController],
  providers: [StorageLocationService],
})
export class StorageLocationModule {}
