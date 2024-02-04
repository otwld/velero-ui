import { Module } from '@nestjs/common';
import { ServerStatusRequestService } from './server-status-request.service';

@Module({
  providers: [ServerStatusRequestService],
  exports: [ServerStatusRequestService],
})
export class ServerStatusRequestModule {}
