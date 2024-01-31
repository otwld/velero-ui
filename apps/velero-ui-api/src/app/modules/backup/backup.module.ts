import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import {DeleteBackupRequestService} from "../delete-backup-request/delete-backup-request.service";

@Module({
  providers: [BackupService, DeleteBackupRequestService],
  controllers: [BackupController],
})
export class BackupModule {}
