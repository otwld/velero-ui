import { Module } from '@nestjs/common';
import { DeleteBackupRequestService } from './delete-backup-request.service';

@Module({
  controllers: [],
  providers: [DeleteBackupRequestService],
  exports: [DeleteBackupRequestService]
})
export class DeleteBackupRequestModule {}
