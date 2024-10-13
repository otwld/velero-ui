import { Module } from '@nestjs/common';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnapshotLocationModule } from './modules/snapshot-location/snapshot-location.module';
import { K8sCustomObjectModule } from '@velero-ui-api/shared/modules/k8s-custom-object/k8s-custom-object.module';
import { BackupRepositoryModule } from '@velero-ui-api/modules/backup-repository/backup-repository.module';
import { StatsModule } from '@velero-ui-api/modules/stats/stats.module';
import { AppConfigModule } from '@velero-ui-api/modules/app-config/app-config.module';
import { AuthModule } from '@velero-ui-api/modules/auth/auth.module';
import { JwtAuthGuard } from '@velero-ui-api/shared/guards/jwt-auth.guard';
import { LoggerModule } from '@velero-ui-api/shared/modules/logger/logger.module';
import velero from '../config/velero.config';
import k8s from '../config/k8s.config';
import app from '../config/app.config';
import basicAuth from '../config/basic-auth.config';
import ldap from '../config/ldap.config';
import google from '../config/google.config';
import github from '../config/github.config';
import gitlab from '../config/gitlab.config';
import microsoft from '../config/microsoft.config';
import oauth from '../config/oauth.config';
import { FormModule } from '@velero-ui-api/modules/form/form.module';
import { HttpExceptionFilter } from '@velero-ui-api/shared/exceptions/filters/http.exception-filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        velero,
        k8s,
        basicAuth,
        app,
        ldap,
        google,
        github,
        gitlab,
        microsoft,
        oauth,
      ],
    }),
    LoggerModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static'),
    }),
    K8sModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        configPath: configService.get('k8s.configPath'),
        context: configService.get('k8s.context'),
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
    FormModule,
    VeleroModule,
    SettingsModule,
    SnapshotLocationModule,
    K8sCustomObjectModule,
    BackupRepositoryModule,
    StatsModule,
    AppConfigModule,
    AuthModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
