import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Observable, of } from 'rxjs';
import {
  ClusterSettings,
  VeleroAgentSettings,
  VeleroServerSettings,
  VeleroUiSettings,
} from '@velero-ui/shared-types';

@Controller('/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('/cluster')
  public getCluster(): Observable<ClusterSettings> {
    return this.settingsService.getCluster();
  }

  @Get('/velero/server')
  public getVeleroServer(): Observable<VeleroServerSettings> {
    return this.settingsService.getVeleroServer();
  }

  @Get('/velero/agents')
  public getVeleroAgents(): Observable<VeleroAgentSettings[]> {
    return this.settingsService.getVeleroAgents();
  }

  @Get('/velero/ui')
  public getVeleroUi(): Observable<VeleroUiSettings> {
    return this.settingsService.getVeleroUi();
  }
}
