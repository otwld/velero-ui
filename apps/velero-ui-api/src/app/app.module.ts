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
import { DeleteBackupRequestModule } from '@velero-ui-api/modules/delete-backup-request/delete-backup-request.module';
import { DownloadRequestModule } from '@velero-ui-api/modules/download-request/download-request.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServerStatusRequestModule } from '@velero-ui-api/modules/server-status-request/server-status-request.module';
import { SnapshotLocationModule } from './modules/snapshot-location/snapshot-location.module';
import { K8sCustomObjectModule } from '@velero-ui-api/shared/modules/k8s-custom-object/k8s-custom-object.module';
import { BackupRepositoryModule } from '@velero-ui-api/modules/backup-repository/backup-repository.module';
import { StatsModule } from '@velero-ui-api/modules/stats/stats.module';
import velero from '../config/velero.config';
import k8s from '../config/k8s.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [velero, k8s],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static'),
    }),
    K8sModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        kubeConfigPath: configService.get('k8s.kubeConfigPath'),
      }),
      inject: [ConfigService],
    }),
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
    SnapshotLocationModule,
    K8sCustomObjectModule,
    BackupRepositoryModule,
    StatsModule,
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
