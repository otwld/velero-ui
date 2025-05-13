import { Module } from '@nestjs/common';
import { DeleteBackupRequestService } from 'apps/velero-ui-api/src/app/modules/delete-backup-request/delete-backup-request.service';
import {
  DeleteBackupRequestController
} from "@velero-ui-api/modules/delete-backup-request/delete-backup-request.controller";

@Module({
  controllers: [DeleteBackupRequestController],
  providers: [DeleteBackupRequestService],
  exports: [DeleteBackupRequestService]
})
export class DeleteBackupRequestModule {}
