import { Module } from '@nestjs/common';
import { RestoreController } from './restore.controller';
import { RestoreService } from './restore.service';
import { DeleteBackupRequestModule } from '@velero-ui-api/modules/delete-backup-request/delete-backup-request.module';
import { DownloadRequestModule } from '@velero-ui-api/modules/download-request/download-request.module';
import { HttpModule } from '@nestjs/axios';
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
  controllers: [RestoreController],
  providers: [RestoreService],
})
export class RestoreModule {}
