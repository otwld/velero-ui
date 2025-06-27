import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { HttpModule } from '@nestjs/axios';
import { DeleteBackupRequestModule } from '@velero-ui-api/modules/delete-backup-request/delete-backup-request.module';
import { DownloadRequestModule } from '@velero-ui-api/modules/download-request/download-request.module';
import https from 'https';

@Module({
  imports: [
    HttpModule.register({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    }),
    DeleteBackupRequestModule,
    DownloadRequestModule,
  ],
  providers: [BackupService],
  controllers: [BackupController],
  exports: [BackupService],
})
export class BackupModule {}
