import { Module } from '@nestjs/common';
import { BackupRepositoryController } from './backup-repository.controller';
import { DeleteBackupRequestModule } from '@velero-ui-api/modules/delete-backup-request/delete-backup-request.module';
import { DownloadRequestModule } from '@velero-ui-api/modules/download-request/download-request.module';

@Module({
  imports: [DeleteBackupRequestModule, DownloadRequestModule],
  controllers: [BackupRepositoryController],
  providers: [],
})
export class BackupRepositoryModule {}
