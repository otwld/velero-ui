import { Module } from '@nestjs/common';
import { DownloadRequestService } from './download-request.service';

@Module({
  providers: [DownloadRequestService],
  exports: [DownloadRequestService],
})
export class DownloadRequestModule {}
