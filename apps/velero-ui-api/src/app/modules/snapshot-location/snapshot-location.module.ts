import { Module } from '@nestjs/common';
import { SnapshotLocationController } from './snapshot-location.controller';
import { SnapshotLocationService } from './snapshot-location.service';

@Module({
  controllers: [SnapshotLocationController],
  providers: [SnapshotLocationService],
})
export class SnapshotLocationModule {}
