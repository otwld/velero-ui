import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { ServerStatusRequestModule } from '@velero-ui-api/modules/server-status-request/server-status-request.module';
import { SettingsGateway } from '@velero-ui-api/modules/settings/settings.gateway';
import { AuthModule } from '@velero-ui-api/modules/auth/auth.module';
import { CaslModule } from '@velero-ui-api/shared/modules/casl/casl.module';

@Module({
  imports: [AuthModule, CaslModule, ServerStatusRequestModule],
  controllers: [SettingsController],
  providers: [SettingsService, SettingsGateway],
})
export class SettingsModule {}
