import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { ServerStatusRequestModule } from '@velero-ui-api/modules/server-status-request/server-status-request.module';
import { SettingsGateway } from '@velero-ui-api/modules/settings/settings.gateway';

@Module({
  imports: [ServerStatusRequestModule],
  controllers: [SettingsController],
  providers: [SettingsService, SettingsGateway],
})
export class SettingsModule {}
