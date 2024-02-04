import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { ServerStatusRequestModule } from '../../shared/modules/server-status-request/server-status-request.module';

@Module({
  imports: [ServerStatusRequestModule],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
