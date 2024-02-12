import { Module } from '@nestjs/common';
import { ServerStatusRequestService } from 'apps/velero-ui-api/src/app/modules/server-status-request/server-status-request.service';
import { ServerStatusRequestController } from '@velero-ui-api/modules/server-status-request/server-status-request.controller';

@Module({
  controllers: [ServerStatusRequestController],
  providers: [ServerStatusRequestService],
  exports: [ServerStatusRequestService],
})
export class ServerStatusRequestModule {}
