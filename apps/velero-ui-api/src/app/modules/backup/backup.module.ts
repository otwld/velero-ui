import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { HttpModule } from '@nestjs/axios';
import { DeleteBackupRequestModule } from '../../shared/modules/delete-backup-request/delete-backup-request.module';
import { DownloadRequestModule } from '../../shared/modules/download-request/download-request.module';

@Module({
  imports: [HttpModule, DeleteBackupRequestModule, DownloadRequestModule],
  providers: [BackupService],
  controllers: [BackupController],
})
export class BackupModule {}
