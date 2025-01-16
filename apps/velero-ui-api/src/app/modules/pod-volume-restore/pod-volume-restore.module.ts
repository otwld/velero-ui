import { Module } from '@nestjs/common';
import { PodVolumeRestoreController } from '@velero-ui-api/modules/pod-volume-restore/pod-volume-restore.controller';

@Module({
  controllers: [PodVolumeRestoreController],
  providers: [],
  exports: [],
})
export class PodVolumeRestoreModule {}
