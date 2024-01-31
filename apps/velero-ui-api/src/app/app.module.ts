import { Module } from '@nestjs/common';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { K8sModule } from './shared/modules/k8s/k8s.module';
import { BackupModule } from './modules/backup/backup.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { StorageLocationModule } from './modules/storage-location/storage-location.module';
import { RestoreModule } from './modules/restore/restore.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HealthModule } from './modules/health/health.module';
import { HttpModule } from '@nestjs/axios';
import { VeleroModule } from './shared/modules/velero/velero.module';
import { SettingsModule } from './modules/settings/settings.module';
import { DeleteBackupRequestModule } from './modules/delete-backup-request/delete-backup-request.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static'),
    }),
    K8sModule.forRoot('/Users/jdetroyes/.kube/config'),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 1000, // TODO: Change
      },
    ]),
    HttpModule,
    BackupModule,
    ScheduleModule,
    StorageLocationModule,
    RestoreModule,
    HealthModule,
    VeleroModule,
    SettingsModule,
    DeleteBackupRequestModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
