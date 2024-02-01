import { Module } from '@nestjs/common';
import { DeleteBackupRequestController } from './delete-backup-request.controller';
import { DeleteBackupRequestService } from './delete-backup-request.service';

@Module({
  controllers: [DeleteBackupRequestController],
  providers: [DeleteBackupRequestService],
  exports: [DeleteBackupRequestService]
})
export class DeleteBackupRequestModule {}
