import { Module } from '@nestjs/common';
import { DownloadRequestService } from 'apps/velero-ui-api/src/app/modules/download-request/download-request.service';
import { DownloadRequestController } from '@velero-ui-api/modules/download-request/download-request.controller';

@Module({
  controllers: [DownloadRequestController],
  providers: [DownloadRequestService],
  exports: [DownloadRequestService],
})
export class DownloadRequestModule {}
